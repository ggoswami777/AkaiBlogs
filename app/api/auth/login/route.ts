import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { checkRateLimit ,resetRateLimit,getClientIp} from "@/lib/redis/rateLimit";
import { getZodErrorMessage, loginSchema } from "@/lib/validations/auth";
import { ZodError } from "zod";

const LOGIN_RATE_LIMIT={
  maxAttempts:5,
  windowSeconds:15*60,
}
export async function POST(request: NextRequest) {
  try {
    const body=await request.json();
    const {email,password}=loginSchema.parse(body);
    const clientIp=getClientIp(request);
    const rateLimit=await checkRateLimit(
      clientIp,
      "rate-limit:login",
      LOGIN_RATE_LIMIT
    )
    if(!rateLimit.allowed){
      return NextResponse.json(
        {
          success:false,
          error:`Too many login attempts. Try again in ${rateLimit.retryAfter} seconds.`
        }
      )
    }
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
      await resetRateLimit(clientIp,"rate-limit:login");
      const token=jwt.sign({userId:existingUser.id , username:existingUser.username},process.env.JWT_SECRET as string ,{expiresIn:"7d"})
      const response=NextResponse.json({
        success:true,
        message:"User loggedIn Successfully",
      })
      response.cookies.set("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"lax",
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
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: getZodErrorMessage(error),
        },
        { status: 400 },
      );
    }

    console.error("Auth error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Server error, please try again later",
      },
      { status: 500 },
    );
  }
}
