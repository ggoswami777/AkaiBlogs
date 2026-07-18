import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { generateOtp, getOtpExpiryDate, getOtpExpiryMinutes, hashOtp } from "@/lib/otp";
import { checkRateLimit, getClientIp } from "@/lib/redis/rateLimit";
import { addOtpEmailJob } from "@/lib/queue/producers";

const OTP_RATE_LIMIT = {
  maxAttempts: 3,
  windowSeconds: 10 * 60,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "User with this email does not exist." },
        { status: 404 }
      );
    }

    const clientIp = getClientIp(request);
    const rateLimit = await checkRateLimit(
      clientIp,
      "rate-limit:forgot-otp",
      OTP_RATE_LIMIT
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many OTP requests. Try again in ${rateLimit.retryAfter} seconds.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimit.retryAfter.toString(),
          },
        }
      );
    }

    const otp = generateOtp();
    const hashedOtp = await hashOtp(otp);
    const otpExpiry = getOtpExpiryDate();
    const expiryMinutes = getOtpExpiryMinutes();

    await prisma.oTPVerification.upsert({
      where: { email: normalizedEmail },
      update: {
        username: existingUser.username,
        password: existingUser.password,
        otp: hashedOtp,
        otpExpiry,
        isVerified: false,
      },
      create: {
        email: normalizedEmail,
        username: existingUser.username,
        password: existingUser.password,
        otp: hashedOtp,
        otpExpiry,
      },
    });

    await addOtpEmailJob({
      email: normalizedEmail,
      username: existingUser.username,
      otp,
      expiryMinutes,
    });

    console.log(`[Forgot Password OTP for ${normalizedEmail}]: ${otp}`);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Forgot password send-otp error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
