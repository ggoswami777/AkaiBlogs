import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { compareOtp } from "@/lib/otp";
import { signupSchema, getZodErrorMessage } from "@/lib/validations/auth";
import { ZodError } from "zod";
export async function POST(request: NextRequest) {
  const body=await request.json();
  const { username, email, password, otp } =signupSchema.parse(body);
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
    if (verifyingOtp.username !== username) {
      return NextResponse.json(
        {
          success: false,
          message: "Username does not match OTP request",
        },
        { status: 400 },
      );
    }

    const isOtpValid=await compareOtp(otp,verifyingOtp.otp);
    if (!isOtpValid) {
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
      { userId: newUser.id ,username:newUser.username},
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
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
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

    console.error("Signup error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
