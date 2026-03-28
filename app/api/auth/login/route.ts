import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
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
          success:false,
            error:"User do not exists,Please signup first"
        },{status:409})
    }
    // check if password is correct 
    const passwordComparision=await bcrypt.compare(password,existingUser.password);
    if(passwordComparision){
      const token=jwt.sign({userId:existingUser.id},process.env.JWT_SECRET as string ,{expiresIn:"7d"})
      const response=NextResponse.json({
        success:true,
        message:"User loggedIn Successfully",
      })
      response.cookies.set("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"strict",
        maxAge:60*60*24*7,
        path:'/',
      })
      return response;
    }else{
      return NextResponse.json(
      { error: "Incorrect Password!",success:false }, 
      { status: 400 }
    );
    }

  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Server error, please try again later" , success:false}, 
      { status: 500 }
    );
  }
}
