import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest,{params}:{params:Promise<{username:string}>}) {
    try {
        const {username}=await params;
        const user=await prisma.user.findUnique({
            where:{username},
            select:{id:true,publicKey:true},
        });
        if(!user || !user.publicKey){
            return NextResponse.json({
                success:false,error:"Public key not found"
            },{status:404});
        }
        return NextResponse.json({
            success:true,
            userId:user.id,
            publicKey:user.publicKey,
        });
    } catch (error) {
       return NextResponse.json({success:false,error:"Failed to fetch key"},{status:500}) 
    }
}