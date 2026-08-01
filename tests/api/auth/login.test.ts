import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("@/lib/redis/rateLimit", () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ allowed: true }),
  resetRateLimit: vi.fn(),
  getClientIp: vi.fn().mockReturnValue("127.0.0.1"),
}));

// Mock bcryptjs
vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
  compare: vi.fn(),
  hash: vi.fn(),
}));

import { POST } from "@/app/api/auth/login/route";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, resetRateLimit } from "@/lib/redis/rateLimit";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

function makeRequest(body: object) {
  return new NextRequest("http://localhost/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true, remaining: 4, retryAfter: 0 } as any);
    vi.mocked(resetRateLimit).mockResolvedValue(undefined as any);
    vi.mocked(bcrypt.compare).mockResolvedValue(false as any);
  });

  it("returns 400 for missing email", async () => {
    const req = makeRequest({ password: "pass1234" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
    expect(data.success).toBe(false);
  });

  it("returns 400 for missing password", async () => {
    const req = makeRequest({ email: "test@example.com" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
    expect(data.success).toBe(false);
  });

  it("returns 400 for invalid email format", async () => {
    const req = makeRequest({ email: "bad", password: "pass1234" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/valid email/i);
  });

  it("returns 409 when user not found", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    const req = makeRequest({ email: "no@one.com", password: "pass1234" });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(409);
    expect(data.error).toMatch(/not exist/i);
  });

  it("returns 400 when password is incorrect", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "u1",
      email: "test@example.com",
      username: "testuser",
      password: "hashedpassword",
    } as any);
    vi.mocked(bcrypt.compare).mockResolvedValue(false as any);

    const req = makeRequest({ email: "test@example.com", password: "wrongpass" });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toMatch(/Incorrect Password/i);
  });

  it("returns 429 when rate limited", async () => {
    vi.mocked(checkRateLimit).mockResolvedValue({
      allowed: false,
      remaining: 0,
      retryAfter: 900,
    } as any);

    const req = makeRequest({ email: "test@example.com", password: "pass1234" });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(429);
    expect(data.error).toMatch(/Too many login attempts/i);
  });

  it("returns 200 and sets cookie on successful login", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "u1",
      email: "test@example.com",
      username: "testuser",
      password: "$2a$10$hashedpassword",
    } as any);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as any);

    const req = makeRequest({ email: "test@example.com", password: "correctpass" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toMatch(/loggedIn Successfully/i);
    expect(res.headers.get("set-cookie")).toMatch(/token=/);
    expect(resetRateLimit).toHaveBeenCalled();
  });
});