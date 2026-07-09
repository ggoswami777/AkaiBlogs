import { getAuthUser } from "@/lib/authHelper";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
    request:NextRequest,
    {params}:{params:Promise<{conversationId:string}>},
){
    try {
        const activeUser=getAuthUser(request);
        const {conversationId}=await params;
        const participant=await prisma.conversationParticipant.findUnique({
            where:{
                conversationId_userId:{
                    conversationId,
                    userId:activeUser.userId,
                }
            }
        })
        if(!participant){
            return NextResponse.json({
                success:false,
                error:"Forbidden",
            },{status:403})
        }
        const {searchParams}=new URL(request.url);
        const cursor=searchParams.get("cursor");
        const messages=await prisma.message.findMany({
            where:{
                conversationId,
            },
            include:{
                sender:{
                    select:{
                        id:true,
                        username:true,
                        avatarUrl:true,
                    }
                },
                sharedBlog:{
                    select:{
                        id:true,
                        title:true,
                        excerpt:true,
                        coverImage:true,
                        author:{
                            select:{
                                username:true,
                            },
                        },
                    },
                },
            },
            orderBy:{
                createdAt:"desc",
            },
            take:30,
            ...(cursor && {
                skip:1,
                cursor:{
                    id:cursor,
                }
            })
        })
        return NextResponse.json({
            success:true,
            messages:messages.reverse(),
            nextCursor:messages.length===30?messages[0].id:null,
        })
    } catch (error) {
        return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch messages",
      },
      { status: 500 },
    );
    }
}