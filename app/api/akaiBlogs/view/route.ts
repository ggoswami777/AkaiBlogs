import { getAuthUserServer } from "@/lib/authHelper";

import { prisma } from "@/lib/prisma";
import { addAnalyticsJob } from "@/lib/queue/producers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    try{
        const {blogId}=await request.json();
        if(!blogId){
            return NextResponse.json({
                success:false,error:"Blog Id is required",
                
            },{status:404})
        }
        const activeUser=await getAuthUserServer();
        const blog=await prisma.blog.findUnique({
            where:{id:blogId},
            select:{
                id:true,
                category:true
            }
        })
        if(!blog){
            return NextResponse.json(
                {success:false,error:"Blog not found"},
                {status:404},
            )
        }
        if (activeUser) {
         
            const existingView = await prisma.blogView.findFirst({
                where: {
                    userId: activeUser.userId,
                    blogId: blogId
                }
            });

            if (!existingView) {
                await prisma.$transaction([
                    prisma.blog.update({
                        where: { id: blogId },
                        data: {
                            viewsCount: {
                                increment: 1,
                            }
                        }
                    }),
                    prisma.blogView.create({
                        data: {
                            blogId,
                            userId: activeUser.userId,
                        }
                    })
                ]);

                await addAnalyticsJob({blogId,category:blog.category,action:"view",userId:activeUser.userId})
            }
        } else {
           
            await prisma.$transaction([
                prisma.blog.update({
                    where: { id: blogId },
                    data: {
                        viewsCount: {
                            increment: 1,
                        },
                    },
                }),
                prisma.blogView.create({
                    data: {
                        blogId,
                        userId: null
                    },
                }),
            ]);
        }
        return NextResponse.json({
            success:true,
            message:"View tracked"
        })
       
    }
    catch(error){
        console.error("View tracking error:",error);
        return NextResponse.json(
            {success:false,error:"Failed to track view"},
            {status:500},
        )
    }
}