import { getAuthUser } from "@/lib/authHelper";
import { prisma } from "@/lib/prisma";
import { addFeedInvalidationJob } from "@/lib/queue/producers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {userId,username}=getAuthUser(request);
    const { title, excerpt, category, image, content } = await request.json();
    const newBlog=await prisma.blog.create({
        data:{
            title,
            content,
            excerpt,
            coverImage:image,
            category:category || "General",
            authorId:userId
        }
    })
    await addFeedInvalidationJob({type:"all"});
    return NextResponse.json({
        success:true,
        message:"Scrolled successfully forged by"+username,
        blog:newBlog,
    })
  } catch (error:any) {
    const status=error.message.includes("Unauthorized")?401:500;
    return NextResponse.json({
        success:false,
        error:error.message ||  "Failed to forge scroll",
    },{status})
  }

}
