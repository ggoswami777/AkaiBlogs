import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    oTPVerification: {
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock("@/lib/otp", () => ({
  compareOtp: vi.fn(),
}));

vi.mock("@/lib/redis/rateLimit", () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ allowed: true }),
  resetRateLimit: vi.fn(),
  getClientIp: vi.fn().mockReturnValue("127.0.0.1"),
}));

import { POST } from "@/app/api/auth/signup/route";
import { prisma } from "@/lib/prisma";
import { compareOtp } from "@/lib/otp";
import { NextRequest } from "next/server";

function makeRequest(body: object) {
  return new NextRequest("http://localhost/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/signup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  it("returns 409 when email already exists", async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue({
      id: "u1",
      email: "test@example.com",
      username: "existinguser",
    } as any);

    const req = makeRequest({
      username: "newuser",
      email: "test@example.com",
      password: "password123",
      otp: "123456",
    });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(409);
    expect(data.error).toMatch(/Email already exists/i);
  });

  it("returns 409 when username already exists", async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue({
      id: "u1",
      email: "other@example.com",
      username: "takenuser",
    } as any);

    const req = makeRequest({
      username: "takenuser",
      email: "new@example.com",
      password: "password123",
      otp: "123456",
    });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(409);
    expect(data.error).toMatch(/Username already exists/i);
  });

  it("returns 404 when OTP not found", async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.oTPVerification.findUnique).mockResolvedValue(null);

    const req = makeRequest({
      username: "newuser",
      email: "test@example.com",
      password: "password123",
      otp: "123456",
    });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(404);
    expect(data.message).toMatch(/OTP not found/i);
  });

  it("returns 400 when username does not match OTP request", async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.oTPVerification.findUnique).mockResolvedValue({
      email: "test@example.com",
      username: "otpuser",
      otp: "hashedotp",
      password: "hashedpassword",
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
    } as any);

    const req = makeRequest({
      username: "differentuser",
      email: "test@example.com",
      password: "password123",
      otp: "123456",
    });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.message).toMatch(/Username does not match/i);
  });

  it("returns 400 when OTP is invalid", async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.oTPVerification.findUnique).mockResolvedValue({
      email: "test@example.com",
      username: "testuser",
      otp: "hashedotp",
      password: "hashedpassword",
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
    } as any);
    vi.mocked(compareOtp).mockResolvedValue(false);

    const req = makeRequest({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      otp: "123456",
    });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.message).toMatch(/Invalid OTP/i);
  });

  it("returns 400 when OTP has expired", async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.oTPVerification.findUnique).mockResolvedValue({
      email: "test@example.com",
      username: "testuser",
      otp: "hashedotp",
      password: "hashedpassword",
      otpExpiry: new Date(Date.now() - 1000), // expired
    } as any);
    vi.mocked(compareOtp).mockResolvedValue(true);

    const req = makeRequest({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      otp: "123456",
    });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.message).toMatch(/OTP has expired/i);
  });

  it("creates user successfully with valid OTP", async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.oTPVerification.findUnique).mockResolvedValue({
      email: "test@example.com",
      username: "testuser",
      otp: "hashedotp",
      password: "hashedpassword",
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
    } as any);
    vi.mocked(compareOtp).mockResolvedValue(true);

    const newUser = {
      id: "u1",
      username: "testuser",
      email: "test@example.com",
    };
    vi.mocked(prisma.$transaction).mockResolvedValue([newUser, {}]);

    const req = makeRequest({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      otp: "123456",
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toMatch(/User Created successfully/i);
    expect(data.user).toEqual({ id: "u1", username: "testuser" });
    expect(res.headers.get("set-cookie")).toMatch(/token=/);
  });
});