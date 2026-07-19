import { deleteBlogFromAlgolia, deleteUserFromAlgolia, syncBlogToAlgolia, syncUserToAlgolia } from "@/lib/algolia/sync";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


function verifySecret(request:NextRequest):boolean{
    const secret=request.headers.get("x-webhook-secret");
    return secret===process.env.SUPABASE_WEBHOOK_SECRET;
}

export async function POST(request:NextRequest) {
    try {
        if(!verifySecret(request)){
            return NextResponse.json({error:"Unauthorized"},{status:401});
        }
        const payload=await request.json();
        // supabase webhook payload format
        const eventType:string=payload.type;
        const table:string=payload.table;
        const record=payload.record;
        const oldRecord=payload.old_record;
        console.log(`Webhook received: ${eventType} on ${table}`)
        if(table==="Blog"){
            await handleBlogEvent(eventType,record,oldRecord);
        }else if(table==="User"){
            await handleUserEvent(eventType,record,oldRecord);
        }
        return NextResponse.json({success:true})
    } catch (error) {
        console.error("Webhook error:",error);
        return NextResponse.json({error:"Webhook failed"},{
            status:500
        });
    }
}
async function handleBlogEvent(eventType:string,record:any,oldRecord:any) {
    if(eventType==="INSERT" || eventType==="UPDATE"){
        const blog=await prisma.blog.findUnique({
            where:{id:record.id},
            include:{author:{select:{username:true,avatarUrl:true}}},
        });
        if(blog){
            await syncBlogToAlgolia(blog);
        }
    }else if(eventType==="DELETE"){
        const blogId=oldRecord?.id || record?.id;
        if(blogId){
            await deleteBlogFromAlgolia(blogId);
        }
    }
}
async function handleUserEvent(eventType: string, record: any, oldRecord: any) {
  if (eventType === "INSERT" || eventType === "UPDATE") {
    const user = await prisma.user.findUnique({
      where: { id: record.id },
    });
    if (user) {
      await syncUserToAlgolia(user);
    }
  } else if (eventType === "DELETE") {
    const userId = oldRecord?.id || record?.id;
    if (userId) {
      await deleteUserFromAlgolia(userId);
    }
  }
}