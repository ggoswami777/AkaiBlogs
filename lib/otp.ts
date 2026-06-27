import bcrypt from "bcryptjs";

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function hashOtp(otp: string) {
  return bcrypt.hash(otp, 10);
}

export async function compareOtp(otp: string, hashedOtp: string) {
  return bcrypt.compare(otp, hashedOtp);
}

export function getOtpExpiryDate() {
  const expiryMinutes = Number(process.env.OTP_EXPIRY_MINUTES || 10);
  return new Date(Date.now() + expiryMinutes * 60 * 1000);
}

export function getOtpExpiryMinutes() {
  return Number(process.env.OTP_EXPIRY_MINUTES || 10);
}