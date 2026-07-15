import { getAuthUserServer } from "@/lib/authHelper";
import { prisma } from "@/lib/prisma";
import { addAnalyticsJob, addFeedInvalidationJob } from "@/lib/queue/producers";
import { deleteCache, getCache, setCache } from "@/lib/redis/cache";
import { cacheKeys } from "@/lib/redis/cacheKeys";
import { checkRateLimit } from "@/lib/redis/rateLimit";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest){
    try {
        const activeUser=await getAuthUserServer();
        if(!activeUser){
            return NextResponse.json({
                success:false,
                message:"Unauthorized: You must be logged in to comment."
            },{status:401})
        }
        const body=await request.json();
        const {blogId,content}=body;
        if(!blogId||!content || content.trim()===""){
            return NextResponse.json({
                success:false,
                message:"Blog Id and comment content are required"
            },{status:400})
        }
        const dbUser=await prisma.user.findUnique({
            where:{username:activeUser.username},
        });
        if(!dbUser){
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }
        const commentLimit=await checkRateLimit(
            dbUser.id,
            "rate-limit:comments",
            {
                maxAttempts:10,
                windowSeconds:60
            }
        )
        if(!commentLimit.allowed){
            return NextResponse.json({
                success:false,
                message:`Too many comments. Try again in ${commentLimit.retryAfter}s`,
            },{status:429})
        }
        const [newComment]=await prisma.$transaction([
            prisma.comment.create({
                data:{
                    content:content.trim(),
                    blogId:blogId,
                    authorId:dbUser.id
                },
                include:{
                    author:{
                        select:{
                            username:true,
                            avatarUrl:true,
                            id:true
                        },
                    },
                },
            }),
            prisma.blog.update({
                where:{id:blogId},
                data:{
                    commentsCount:{
                        increment:1,
                    }
                },
            }),
        ]);
        const blog=await prisma.blog.findUnique({
            where:{id:blogId},
            select:{
                category:true,
            },
        });
        if(blog){
            await addAnalyticsJob({ blogId, category: blog.category, action: "comment", userId: dbUser.id });

        }
        await addFeedInvalidationJob({ userId: dbUser.id, type: "single" });
        await deleteCache(cacheKeys.comments(blogId));
        return NextResponse.json({
            success: true,
            message: "Comment posted successfully",
            comment: newComment,
        });

    } catch (error) {
        console.error("Error posting comment:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to post comment"
        }, { status: 500 });
    }
}


export async function GET(request:NextRequest){
    try {
        const {searchParams}=new URL(request.url);
        const blogId=searchParams.get("blogId");
        if(!blogId){
            return NextResponse.json({
                success:false,
                message:"BlogId is required"
            },{status:400})
        }
        const cacheKey=cacheKeys.comments(blogId);
        const cachedComments=await getCache<unknown[]>(cacheKey);
        if(cachedComments){
            return NextResponse.json({
                success:true,
                comments:cachedComments,
            })
        }
        const comments=await prisma.comment.findMany({
            where:{
                blogId:blogId
            },
            include:{
                author:{
                    select:{
                        id:true,
                        username:true,
                        avatarUrl:true,
                    }
                }
            },
            orderBy:{
                createdAt:"desc"
            }
        });
        await setCache(cacheKey,comments,60);
        return NextResponse.json({
            success: true,
            comments: comments
        },{status:200});
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch comments"
        }, { status: 500 });
    }
}