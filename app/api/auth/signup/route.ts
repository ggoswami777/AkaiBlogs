import { prisma } from "@/lib/prisma";
import { verify } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
export async function POST(request: NextRequest) {
  const { username, email, password, otp } = await request.json();
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username: username }, { email: email }],
    },
  });
  if (existingUser) {
    const field = existingUser.email === email ? "Email" : "Username";
    return NextResponse.json(
      { error: `${field} already exists` },
      { status: 409 },
    );
  }
  // verify otp

  try {
    const verifyingOtp = await prisma.oTPVerification.findUnique({
      where: { email: email },
    });
    if (!verifyingOtp) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP not found. Please resend.",
        },
        { status: 404 },
      );
    }
    if (verifyingOtp.otp !== otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid OTP",
        },
        { status: 400 },
      );
    }
    if (new Date() > verifyingOtp.otpExpiry) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP has expired",
        },
        { status: 400 },
      );
    }
    // user creation
    const [newUser, deletedOtp] = await prisma.$transaction([
      prisma.user.create({
        data: {
          username: verifyingOtp.username,
          email: verifyingOtp.email,
          password: verifyingOtp.password,
        },
      }),
      prisma.oTPVerification.delete({
        where: { email: email },
      }),
    ]);

    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );
    const response = NextResponse.json({
      success: true,
      message: "User Created successfully",
      user: { id: newUser.id, username: newUser.username },
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
