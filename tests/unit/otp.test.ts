import { describe, it, expect } from "vitest";
import { generateOtp, hashOtp, compareOtp, getOtpExpiryDate } from "@/lib/otp";

describe("OTP utilities", () => {
  it("generates 6-digit numeric string", () => {
    const otp = generateOtp();
    expect(otp).toHaveLength(6);
    expect(/^\d{6}$/.test(otp)).toBe(true);
  });

  it("hashes and compares OTP correctly", async () => {
    const otp = "123456";
    const hashed = await hashOtp(otp);
    expect(await compareOtp(otp, hashed)).toBe(true);
    expect(await compareOtp("000000", hashed)).toBe(false);
  });

  it("returns future expiry date", () => {
    const expiry = getOtpExpiryDate();
    expect(expiry.getTime()).toBeGreaterThan(Date.now());
  });
});