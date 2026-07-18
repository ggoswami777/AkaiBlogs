import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { compareOtp } from "@/lib/otp";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const verification = await prisma.oTPVerification.findUnique({
      where: { email: normalizedEmail },
    });

    if (!verification) {
      return NextResponse.json(
        { success: false, error: "No OTP request found for this email." },
        { status: 400 }
      );
    }

    if (new Date() > new Date(verification.otpExpiry)) {
      return NextResponse.json(
        { success: false, error: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    const isMatch = await compareOtp(otp.trim(), verification.otp);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid OTP. Please try again." },
        { status: 400 }
      );
    }

    await prisma.oTPVerification.update({
      where: { email: normalizedEmail },
      data: { isVerified: true },
    });

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    console.error("Forgot password verify-otp error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify OTP." },
      { status: 500 }
    );
  }
}
