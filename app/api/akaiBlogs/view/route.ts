import { getAuthUserServer } from "@/lib/authHelper";
import { updateUserInterest } from "@/lib/feed/updateUserInterest";
import { prisma } from "@/lib/prisma";
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
        await prisma.$transaction([
            prisma.blog.update({
                where:{id:blogId},
                data:{
                    viewsCount:{
                        increment:1,
                    },
                },
            }),
            prisma.blogView.create({
                data:{
                    blogId,
                    userId:activeUser?.userId
                },
            }),
        ]);
        if(activeUser){
            await updateUserInterest({
                userId:activeUser.userId,
                category:blog.category,
                action:"view"
            })
        }
        return NextResponse.json({
            success:true,
            message:"View tracked",
        });
    }
    catch(error){
        console.error("View tracking error:",error);
        return NextResponse.json(
            {success:false,error:"Failed to track view"},
            {status:500},
        )
    }
}