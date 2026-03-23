import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {email,password}=await request.json();
    const existingUser=await prisma.user.findUnique({
        where:{
            email:email
        }
    })
    if(!existingUser){
        return NextResponse.json({
            error:"User do not exists,Please signup first"
        },{status:409})
    }
    // check if password is correct and send success true

  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Server error, please try again later" }, 
      { status: 500 }
    );
  }
}
