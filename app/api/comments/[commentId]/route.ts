import { getAuthUser, getAuthUserServer } from "@/lib/authHelper";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

async function getAuthorizedComment(commentId:string,userId:string,checkOwnerOnly=false) {
    
    const comment=await prisma.comment.findUnique({
        where:{id:commentId},
        include:{
            author:true,
            blog: {
                select: {
                    authorId: true
                }
            }
        },
    })
    if(!comment){
        return null;
    }
    const isOwner=comment.authorId===userId;
    const isBlogOwner=comment.blog.authorId===userId; 
    const isAdmin=comment.author.username==="admin"
    if(checkOwnerOnly?isOwner:(isOwner || isBlogOwner || isAdmin)){
        return comment;
    }
    return null;
}
// edit comment 
export async function PATCH(request:NextRequest,{params}:{params:Promise<{commentId:string}>}) {
    try {
        const { commentId } = await params;
        const activeUser=getAuthUser(request);
        if(!activeUser){
            return NextResponse.json({success:false,message:"Unauthorized"},{status:401})
        }
        const {content}=await request.json();
        if(!content || content.trim()===""){
            return NextResponse.json({success:false,message:"Content is required"},{status:400});
        }
        const comment=await getAuthorizedComment(commentId,activeUser.userId,true);
        if(!comment){
            return NextResponse.json({success:false,message:"Forbidden or comment not found"},{status:403});
        }
        const updatedComment=await prisma.comment.update(
            {
                where:{id:commentId},
                data:{
                    content:content.trim(),
                }
            }
        );
        return NextResponse.json({success:true,comment:updatedComment});

    } catch (error) {
        console.log("Error editing comment", error);
        return NextResponse.json({
            success:false,
            message:"Error updating comment"
        },{status:500});
    }
}

// Delete comment
export async function DELETE(request:NextRequest,{params}:{params:Promise<{commentId:string}>}){
    try {
        const { commentId } = await params;
        const activeUser=await getAuthUserServer();
        if(!activeUser){
            return NextResponse.json({success:false,message:"Unauthorized"},{status:401});
        }
        const comment=await getAuthorizedComment(commentId,activeUser.userId,false);
            if(!comment){
                return NextResponse.json({success:false,message:"Forbidden or comment not found"},{status:403});
            }
            await prisma.$transaction([
                prisma.comment.delete({
                    where:{id:commentId}
                }),
                prisma.blog.update({
                    where:{id:comment.blogId},
                    data:{commentsCount:{decrement:1}},
                })
            ])
            return NextResponse.json({
                success:true,message:"Comment deleted successfully!"
            })
            
    } catch (error) {
        console.log("Error deleting comment", error);
        return NextResponse.json({
            success:false,
            message:"Error deleting comment",
        },{status:500});
    }
}