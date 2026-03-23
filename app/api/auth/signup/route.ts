import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
    const {username,email,password,otp}=await request.json();
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { email: email }
        ]
      }
    });
    if(existingUser){
        const field=existingUser.email===email?"Email":"Username";
        return NextResponse.json(
            {error:`${field} already exists`},{status:409}
        )
    }
    // verify otp 
    

}