import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    blog: {
      create: vi.fn(),
    },
  },
}));

vi.mock("@/lib/queue/producers", () => ({
  addFeedInvalidationJob: vi.fn(),
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    verify: vi.fn().mockReturnValue({ userId: "u1", username: "testuser" }),
  },
}));

import { POST } from "@/app/api/akaiBlogs/create/route";
import { prisma } from "@/lib/prisma";
import { addFeedInvalidationJob } from "@/lib/queue/producers";
import { NextRequest } from "next/server";

function makeRequest(body: object, cookieHeader?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (cookieHeader) headers["cookie"] = cookieHeader;
  return new NextRequest("http://localhost/api/akaiBlogs/create", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

describe("POST /api/akaiBlogs/create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  it("returns 401 when no token is provided", async () => {
    const req = makeRequest({ title: "Test", content: "Content", excerpt: "Excerpt", image: "img.jpg" });
    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toMatch(/Unauthorized/i);
  });

  it("returns 200 and creates blog successfully", async () => {
    const newBlog = {
      id: "b1",
      title: "Test Blog",
      content: "Blog content",
      excerpt: "Excerpt",
      coverImage: "img.jpg",
      category: "Tech",
      authorId: "u1",
    };
    vi.mocked(prisma.blog.create).mockResolvedValue(newBlog as any);
    vi.mocked(addFeedInvalidationJob).mockResolvedValue(undefined as any);

    const req = makeRequest(
      { title: "Test Blog", content: "Blog content", excerpt: "Excerpt", image: "img.jpg", category: "Tech" },
      "token=valid-token"
    );
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.blog).toEqual(newBlog);
    expect(data.message).toMatch(/testuser/);
    expect(addFeedInvalidationJob).toHaveBeenCalledWith({ type: "all" });
  });

  it("defaults category to General when not provided", async () => {
    vi.mocked(prisma.blog.create).mockResolvedValue({ id: "b1", category: "General" } as any);
    vi.mocked(addFeedInvalidationJob).mockResolvedValue(undefined as any);

    const req = makeRequest(
      { title: "Test", content: "Content", excerpt: "Excerpt", image: "img.jpg" },
      "token=valid-token"
    );
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(prisma.blog.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ category: "General" }) })
    );
  });
});
