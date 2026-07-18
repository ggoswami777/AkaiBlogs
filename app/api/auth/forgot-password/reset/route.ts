import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, newPassword } = body;

    if (!email || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Email and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8 || newPassword.length > 72) {
      return NextResponse.json(
        { success: false, error: "Password must be between 8 and 72 characters." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const verification = await prisma.oTPVerification.findUnique({
      where: { email: normalizedEmail },
    });

    if (!verification || !verification.isVerified) {
      return NextResponse.json(
        { success: false, error: "Please verify your OTP first." },
        { status: 400 }
      );
    }

    if (new Date() > new Date(verification.otpExpiry)) {
      return NextResponse.json(
        { success: false, error: "Verification expired. Please request a new OTP." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { email: normalizedEmail },
        data: { password: hashedPassword },
      }),
      prisma.oTPVerification.delete({
        where: { email: normalizedEmail },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Forgot password reset error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reset password." },
      { status: 500 }
    );
  }
}
