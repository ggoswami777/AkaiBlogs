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

import { POST } from "@/app/api/auth/login/route";
import { prisma } from "@/lib/prisma";
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
  });

  it("returns 400 for invalid body", async () => {
    const req = makeRequest({ email: "bad" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 409 when user not found", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    const req = makeRequest({ email: "no@one.com", password: "pass1234" });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(409);
    expect(data.error).toMatch(/not exist/i);
  });
});
