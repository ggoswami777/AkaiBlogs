import { getAuthUser } from "@/lib/authHelper";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest) {
    try {
        const {userId}=getAuthUser(request);
        const {publicKey}=await request.json();
        if(!publicKey || typeof publicKey!=="string"){
            return NextResponse.json({success:false,error:"Invalid public key"},{status:400});
        }
        await prisma.user.update({
            where:{id:userId},
            data:{publicKey},
        })
        return NextResponse.json({success:true});
    } catch (error) {
        return NextResponse.json({success:false,error:"Unauthorized"},{status:401});
    }
}