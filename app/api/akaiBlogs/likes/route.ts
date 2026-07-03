import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/authHelper";
import { prisma } from "@/lib/prisma";
import { updateUserInterest } from "@/lib/feed/updateUserInterest";
import { invalidateFeedCache } from "@/lib/feed/invalidateFeedCache";
import { checkRateLimit } from "@/lib/redis/rateLimit";

export async function POST(request: NextRequest){
    try {
        const session=getAuthUser(request);
        if(!session?.username){
            return NextResponse.json({success:false,error:"Unauthorized"},{status:401});
        }
        const {blogId}=await request.json();
        if(!blogId){
            return NextResponse.json({success:false,error:"Blog ID is required"},{status:400});
        }
        const user=await prisma.user.findUnique({
            where:{username:session.username},
            select:{id:true},
        })
        
        if(!user?.id){
            return NextResponse.json({success:false,error:"User not found"},{status:404});
        }
        const likeLimit=await checkRateLimit(
            user.id,
            "rate-limit:likes",
            {
                maxAttempts:30,
                windowSeconds:60,
            }
        )
        if(!likeLimit.allowed){
            return NextResponse.json({
                success:false,
                error:`Too many like actions. Try again in ${likeLimit.retryAfter}s`,
            },{status:429})
        }
        const existingLike=await prisma.like.findUnique({
            where:{
                userId_blogId:{userId:user.id,blogId:blogId}
            }
        })

        let action="liked";
        if(existingLike){
            await prisma.like.delete({
                where:{
                    userId_blogId:{
                        userId:user.id,
                        blogId:blogId,
                    }
                }
            })
            // decrement liked
            await prisma.blog.update({
                where:{id:blogId},
                data:{likesCount:{decrement:1}}
            })
            action="unliked";
        }else{
            // add like
            await prisma.like.create({
                data:{
                    userId:user.id,
                    blogId:blogId,
                }
            })
            // increase likes
            await prisma.blog.update({
                where:{id:blogId},
                data:{likesCount:{increment:1}},
            })
            action="liked";

            const blog=await prisma.blog.findUnique({
                where:{id:blogId},
                select:{
                    category:true
                }
            })
            if(blog){
                await updateUserInterest({
                    userId:user.id,
                    category:blog.category,
                    action:"like"
                })
            }
        }
        const updatedBlog=await prisma.blog.findUnique({
            where:{id:blogId},
            select:{
                likesCount:true,
            }
        })
        await invalidateFeedCache(user.id);
        return NextResponse.json({
      success: true,
      action,
      likesCount: updatedBlog?.likesCount,
    });
    } catch (error) {
        return NextResponse.json({success:false,error:"Unauthorized"},{status:401});
    }
}