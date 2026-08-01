import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    comment: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
    blog: {
      update: vi.fn(),
      findUnique: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock("@/lib/redis/cache", () => ({
  getCache: vi.fn().mockResolvedValue(null),
  setCache: vi.fn(),
  deleteCache: vi.fn(),
}));

vi.mock("@/lib/redis/cacheKeys", () => ({
  cacheKeys: {
    comments: (blogId: string) => `comments:${blogId}:v1`,
  },
}));

vi.mock("@/lib/redis/rateLimit", () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ allowed: true, remaining: 9, retryAfter: 0 }),
}));

vi.mock("@/lib/queue/producers", () => ({
  addAnalyticsJob: vi.fn(),
  addFeedInvalidationJob: vi.fn(),
  addNotificationJob: vi.fn(),
}));

vi.mock("@/lib/authHelper", () => ({
  getAuthUserServer: vi.fn(),
}));

import { POST, GET } from "@/app/api/comments/route";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/redis/rateLimit";
import { getAuthUserServer } from "@/lib/authHelper";
import { getCache, deleteCache } from "@/lib/redis/cache";
import { NextRequest } from "next/server";

function makePostRequest(body: object) {
  return new NextRequest("http://localhost/api/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function makeGetRequest(blogId: string) {
  return new NextRequest(`http://localhost/api/comments?blogId=${blogId}`, { method: "GET" });
}

describe("POST /api/comments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true, remaining: 9, retryAfter: 0 });
    vi.mocked(deleteCache).mockResolvedValue(undefined as any);
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(getAuthUserServer).mockResolvedValue(null);

    const req = makePostRequest({ blogId: "b1", content: "Great post!" });
    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.message).toMatch(/Unauthorized/i);
  });

  it("returns 400 when blogId is missing", async () => {
    vi.mocked(getAuthUserServer).mockResolvedValue({ userId: "u1", username: "testuser" });

    const req = makePostRequest({ content: "Nice!" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.message).toMatch(/Blog Id and comment content are required/i);
  });

  it("returns 400 when content is empty", async () => {
    vi.mocked(getAuthUserServer).mockResolvedValue({ userId: "u1", username: "testuser" });

    const req = makePostRequest({ blogId: "b1", content: "   " });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.message).toMatch(/Blog Id and comment content are required/i);
  });

  it("returns 404 when user not found in DB", async () => {
    vi.mocked(getAuthUserServer).mockResolvedValue({ userId: "u1", username: "testuser" });
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const req = makePostRequest({ blogId: "b1", content: "Great!" });
    const res = await POST(req);
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.message).toMatch(/User not found/i);
  });

  it("returns 429 when rate limited", async () => {
    vi.mocked(getAuthUserServer).mockResolvedValue({ userId: "u1", username: "testuser" });
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "u1" } as any);
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: false, remaining: 0, retryAfter: 60 });

    const req = makePostRequest({ blogId: "b1", content: "Great!" });
    const res = await POST(req);
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.message).toMatch(/Too many comments/i);
  });

  it("returns 200 and creates comment successfully", async () => {
    vi.mocked(getAuthUserServer).mockResolvedValue({ userId: "u1", username: "testuser" });
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "u1", username: "testuser" } as any);
    const newComment = {
      id: "c1",
      content: "Great post!",
      blogId: "b1",
      authorId: "u1",
      author: { username: "testuser", avatarUrl: null, id: "u1" },
    };
    vi.mocked(prisma.$transaction).mockResolvedValue([newComment, {}]);
    vi.mocked(prisma.blog.findUnique).mockResolvedValue({ category: "Tech", authorId: "u2" } as any);

    const req = makePostRequest({ blogId: "b1", content: "Great post!" });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.comment).toEqual(newComment);
    expect(deleteCache).toHaveBeenCalled();
  });
});

describe("GET /api/comments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getCache).mockResolvedValue(null);
  });

  it("returns 400 when blogId is missing", async () => {
    const req = new NextRequest("http://localhost/api/comments", { method: "GET" });
    const res = await GET(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.message).toMatch(/BlogId is required/i);
  });

  it("returns 200 with cached comments", async () => {
    const cachedComments = [{ id: "c1", content: "Cached comment" }];
    vi.mocked(getCache).mockResolvedValue(cachedComments);

    const req = makeGetRequest("b1");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.comments).toEqual(cachedComments);
  });

  it("returns 200 with comments from DB", async () => {
    const dbComments = [
      { id: "c1", content: "Comment 1", author: { id: "u1", username: "user1", avatarUrl: null } },
      { id: "c2", content: "Comment 2", author: { id: "u2", username: "user2", avatarUrl: null } },
    ];
    vi.mocked(prisma.comment.findMany).mockResolvedValue(dbComments as any);

    const req = makeGetRequest("b1");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.comments).toHaveLength(2);
  });
});
