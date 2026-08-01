import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    like: {
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    blog: {
      update: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("@/lib/redis/rateLimit", () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ allowed: true, remaining: 29, retryAfter: 0 }),
}));

vi.mock("@/lib/queue/producers", () => ({
  addAnalyticsJob: vi.fn(),
  addFeedInvalidationJob: vi.fn(),
  addNotificationJob: vi.fn(),
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    verify: vi.fn().mockReturnValue({ userId: "u1", username: "testuser" }),
  },
}));

import { POST } from "@/app/api/akaiBlogs/likes/route";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/redis/rateLimit";
import { addFeedInvalidationJob } from "@/lib/queue/producers";
import { NextRequest } from "next/server";

function makeRequest(body: object, cookieHeader?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (cookieHeader) headers["cookie"] = cookieHeader;
  return new NextRequest("http://localhost/api/akaiBlogs/likes", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

describe("POST /api/akaiBlogs/likes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true, remaining: 29, retryAfter: 0 });
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "u1" } as any);
    vi.mocked(addFeedInvalidationJob).mockResolvedValue(undefined as any);
  });

  it("returns 401 when no token is provided", async () => {
    const req = makeRequest({ blogId: "b1" });
    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toMatch(/Unauthorized/i);
  });

  it("returns 400 when blogId is missing", async () => {
    const req = makeRequest({}, "token=valid-token");
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/Blog ID is required/i);
  });

  it("returns 429 when rate limited", async () => {
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: false, remaining: 0, retryAfter: 30 });

    const req = makeRequest({ blogId: "b1" }, "token=valid-token");
    const res = await POST(req);
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toMatch(/Too many like actions/i);
  });

  it("returns 404 when user not found in DB", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const req = makeRequest({ blogId: "b1" }, "token=valid-token");
    const res = await POST(req);
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toMatch(/User not found/i);
  });

  it("toggles like (unlike) when already liked", async () => {
    vi.mocked(prisma.like.findUnique).mockResolvedValue({ userId: "u1", blogId: "b1" } as any);
    vi.mocked(prisma.like.delete).mockResolvedValue({} as any);
    vi.mocked(prisma.blog.update).mockResolvedValue({} as any);
    vi.mocked(prisma.blog.findUnique).mockResolvedValue({ likesCount: 4 } as any);

    const req = makeRequest({ blogId: "b1" }, "token=valid-token");
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.action).toBe("unliked");
    expect(data.likesCount).toBe(4);
    expect(prisma.like.delete).toHaveBeenCalled();
    expect(prisma.blog.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { likesCount: { decrement: 1 } } })
    );
  });

  it("creates like when not already liked", async () => {
    vi.mocked(prisma.like.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.like.create).mockResolvedValue({} as any);
    vi.mocked(prisma.blog.update).mockResolvedValue({} as any);
    vi.mocked(prisma.blog.findUnique).mockResolvedValue({ likesCount: 6, category: "Tech", authorId: "u2" } as any);

    const req = makeRequest({ blogId: "b1" }, "token=valid-token");
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.action).toBe("liked");
    expect(data.likesCount).toBe(6);
    expect(prisma.like.create).toHaveBeenCalled();
    expect(prisma.blog.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { likesCount: { increment: 1 } } })
    );
  });
});
