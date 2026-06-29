import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { generateOtp, getOtpExpiryDate, getOtpExpiryMinutes, hashOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email/sendOtpEmail";
import { checkRateLimit, getClientIp } from "@/lib/redis/rateLimit";
import { sendOtpSchema, getZodErrorMessage } from "@/lib/validations/auth";
import { ZodError } from "zod";
const OTP_RATE_LIMIT={
  maxAttempts:3,
  windowSeconds:10*60,
}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password } = sendOtpSchema.parse(body);
    const clientIp=getClientIp(request);
    const rateLimit=await checkRateLimit(
      clientIp,
      "rate-limit:otp",
      OTP_RATE_LIMIT
    )
    if(!rateLimit.allowed){
      return NextResponse.json(
        {
          success:false,
          error:`Too many OTP requests. Try again in ${rateLimit.retryAfter} seconds.`,
        },
        {status:429,headers:{
          "Retry-After":rateLimit.retryAfter.toString()
        }}
      )
    }
    if (!email || !username || !password) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();

    if (normalizedUsername.length < 3 || normalizedUsername.length > 24) {
      return NextResponse.json(
        { success: false, error: "Username must be 3-24 characters" },
        { status: 400 },
      );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(normalizedUsername)) {
      return NextResponse.json(
        {
          success: false,
          error: "Username can only contain letters, numbers, and underscores",
        },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: normalizedUsername }, { email: normalizedEmail }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User already exists. Please try logging in." },
        { status: 409 },
      );
    }

    const otp = generateOtp();
    const hashedOtp = await hashOtp(otp);
    const hashedPassword = await bcrypt.hash(password, 10);
    const otpExpiry = getOtpExpiryDate();
    const expiryMinutes = getOtpExpiryMinutes();

    await prisma.oTPVerification.upsert({
      where: { email: normalizedEmail },
      update: {
        username: normalizedUsername,
        password: hashedPassword,
        otp: hashedOtp,
        otpExpiry,
        isVerified: false,
      },
      create: {
        email: normalizedEmail,
        username: normalizedUsername,
        password: hashedPassword,
        otp: hashedOtp,
        otpExpiry,
      },
    });

    await sendOtpEmail({
      email: normalizedEmail,
      username: normalizedUsername,
      otp,
      expiryMinutes,
    });

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
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

    console.error("send-otp error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Error while generating OTP",
      },
      { status: 500 },
    );
  }
}