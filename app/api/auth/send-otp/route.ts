import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, username, password } = await request.json();

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: username }, { email: email }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists. Please try logging in." },
        { status: 409 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);


    await prisma.oTPVerification.upsert({
      where: { email: email },
      update: {
        otp,
        otpExpiry,
        username,
        password: hashedPassword,
        isVerified: false,
      },
      create: {
        email,
        username,
        password: hashedPassword,
        otp,
        otpExpiry,
      },
    });

    console.log("OTP GENERATED:", otp);

    return NextResponse.json({
      success: true,
      otp: otp, 
    });
  } catch (error: any) {
    console.error("send-otp error:", error);
    return NextResponse.json({ 
      error: "Error while generating OTP!",
      details: error.message 
    }, { status: 500 });
  }
}
