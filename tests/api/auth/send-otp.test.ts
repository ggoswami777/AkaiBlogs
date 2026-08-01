import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findFirst: vi.fn(),
    },
    oTPVerification: {
      upsert: vi.fn(),
    },
  },
}));

vi.mock("@/lib/otp", () => ({
  generateOtp: vi.fn().mockReturnValue("123456"),
  hashOtp: vi.fn().mockResolvedValue("hashedotp"),
  getOtpExpiryDate: vi.fn().mockReturnValue(new Date(Date.now() + 10 * 60 * 1000)),
  getOtpExpiryMinutes: vi.fn().mockReturnValue(10),
}));

vi.mock("@/lib/redis/rateLimit", () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ allowed: true }),
  getClientIp: vi.fn().mockReturnValue("127.0.0.1"),
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashedpassword"),
  },
  hash: vi.fn().mockResolvedValue("hashedpassword"),
}));

vi.mock("@/lib/queue/producers", () => ({
  addOtpEmailJob: vi.fn(),
}));

import { POST } from "@/app/api/auth/send-otp/route";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/redis/rateLimit";
import { addOtpEmailJob } from "@/lib/queue/producers";
import { NextRequest } from "next/server";

function makeRequest(body: object) {
  return new NextRequest("http://localhost/api/auth/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/send-otp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true, remaining: 2, retryAfter: 0 });
  });

  it("returns 429 when rate limited", async () => {
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: false, remaining: 0, retryAfter: 300 });

    const req = makeRequest({ email: "test@example.com", username: "testuser", password: "password123" });
    const res = await POST(req);
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toMatch(/Too many OTP requests/i);
  });

  it("returns 409 when user already exists", async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue({
      id: "u1",
      email: "test@example.com",
      username: "testuser",
    } as any);

    const req = makeRequest({ email: "test@example.com", username: "testuser", password: "password123" });
    const res = await POST(req);
    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.error).toMatch(/User already exists/i);
  });

  it("returns 200 and sends OTP successfully", async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.oTPVerification.upsert).mockResolvedValue({} as any);
    vi.mocked(addOtpEmailJob).mockResolvedValue(undefined as any);

    const req = makeRequest({ email: "test@example.com", username: "testuser", password: "password123" });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.message).toMatch(/OTP sent successfully/i);
    expect(prisma.oTPVerification.upsert).toHaveBeenCalled();
    expect(addOtpEmailJob).toHaveBeenCalled();
  });

  it("returns 400 for invalid email via zod", async () => {
    const req = makeRequest({ email: "not-an-email", username: "testuser", password: "password123" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/email/i);
  });

  it("returns 400 for short username via zod", async () => {
    const req = makeRequest({ email: "test@example.com", username: "ab", password: "password123" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/username/i);
  });

  it("returns 400 for short password via zod", async () => {
    const req = makeRequest({ email: "test@example.com", username: "testuser", password: "short" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/password/i);
  });
});
