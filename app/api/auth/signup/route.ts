import { prisma } from "@/lib/prisma";
import { verify } from "crypto";
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
   try {
     const verifyingOtp=await prisma.oTPVerification.findUnique({
      where:{email:email}
    });
    if(!verifyingOtp){
      return NextResponse.json({
        success:false,message:"OTP not found. Please resend."
      },{status:404});
    }
    if(verifyingOtp.otp!==otp){
      return NextResponse.json({
        success:false,message:"Invalid OTP"
      },{status:400});
    }
    if(new Date()>verifyingOtp.otpExpiry){
      return NextResponse.json({
        success:false,
        message:"OTP has expired"
      },{status:400});
    }
    // user creation
    const newUser=await prisma.user.create({
      data:{
        username:verifyingOtp.username,
        email:verifyingOtp.email,
        password:verifyingOtp.password
      }
    })
    await prisma.oTPVerification.delete({
      where :{email:email}
    })
    return NextResponse.json({
      success:true,
      message:"User Created successfully",
      user:{id:newUser.id,username:newUser.username}
    })

   } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
   }
}