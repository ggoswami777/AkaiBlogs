import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/redis/cache", () => ({
  getCache: vi.fn().mockResolvedValue(null),
  setCache: vi.fn(),
}));

vi.mock("@/lib/redis/cacheKeys", () => ({
  cacheKeys: {
    userFeed: (id: string) => `feed:user:${id}:v1`,
    guestFeed: "feed:guest:v1",
  },
}));

vi.mock("@/lib/feed/recomputeFeed", () => ({
  recomputeFeedForUser: vi.fn(),
}));

vi.mock("@/lib/authHelper", () => ({
  getAuthUserServer: vi.fn(),
}));

import { GET } from "@/app/api/akaiBlogs/feed/route";
import { getCache } from "@/lib/redis/cache";
import { recomputeFeedForUser } from "@/lib/feed/recomputeFeed";
import { getAuthUserServer } from "@/lib/authHelper";
import { NextRequest } from "next/server";

function makeRequest(cookieHeader?: string) {
  const headers: Record<string, string> = {};
  if (cookieHeader) headers["cookie"] = cookieHeader;
  return new NextRequest("http://localhost/api/akaiBlogs/feed", { method: "GET", headers });
}

describe("GET /api/akaiBlogs/feed", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getCache).mockResolvedValue(null);
    vi.mocked(getAuthUserServer).mockResolvedValue(null);
  });

  it("returns 200 with blogs from cache", async () => {
    const cachedFeed = { success: true, blogs: [{ id: "b1", title: "Cached Blog" }], topBlogs: [] };
    vi.mocked(getCache).mockResolvedValue(cachedFeed);

    const req = makeRequest();
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.blogs).toHaveLength(1);
    expect(data.blogs[0].title).toBe("Cached Blog");
    expect(recomputeFeedForUser).not.toHaveBeenCalled();
  });

  it("returns 200 and recomputes feed when not cached", async () => {
    const feedResult = {
      success: true,
      blogs: [
        { id: "b1", title: "Blog 1", author: "user1", category: "Tech", likesCount: 5 },
        { id: "b2", title: "Blog 2", author: "user2", category: "General", likesCount: 3 },
      ],
      topBlogs: [],
    };
    vi.mocked(recomputeFeedForUser).mockResolvedValue(feedResult as any);

    const req = makeRequest();
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.blogs).toHaveLength(2);
    expect(recomputeFeedForUser).toHaveBeenCalledWith(null);
  });

  it("returns guest feed when no auth token", async () => {
    vi.mocked(recomputeFeedForUser).mockResolvedValue({ success: true, blogs: [], topBlogs: [] });

    const req = makeRequest();
    await GET(req);
    expect(recomputeFeedForUser).toHaveBeenCalledWith(null);
  });

  it("returns user feed when authenticated", async () => {
    vi.mocked(getAuthUserServer).mockResolvedValue({ userId: "u1", username: "testuser" });
    vi.mocked(recomputeFeedForUser).mockResolvedValue({ success: true, blogs: [], topBlogs: [] });

    const req = makeRequest("token=valid-token");
    await GET(req);
    expect(recomputeFeedForUser).toHaveBeenCalledWith("u1");
  });
});
