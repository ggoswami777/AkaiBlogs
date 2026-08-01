import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("@/lib/redis/cache", () => ({
  getCache: vi.fn().mockResolvedValue(null),
  setCache: vi.fn(),
  deleteCache: vi.fn(),
}));

vi.mock("@/lib/redis/cacheKeys", () => ({
  cacheKeys: {
    profileMe: (id: string) => `profile:me:${id}:v1`,
    publicProfile: (username: string) => `profile:public:${username}:v1`,
  },
}));

vi.mock("@/lib/authHelper", () => ({
  getAuthUser: vi.fn(),
}));

import { GET } from "@/app/api/profile/me/route";
import { prisma } from "@/lib/prisma";
import { getCache, setCache } from "@/lib/redis/cache";
import { getAuthUser } from "@/lib/authHelper";
import { NextRequest } from "next/server";

function makeRequest(cookieHeader?: string) {
  const headers: Record<string, string> = {};
  if (cookieHeader) headers["cookie"] = cookieHeader;
  return new NextRequest("http://localhost/api/profile/me", { method: "GET", headers });
}

describe("GET /api/profile/me", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
    vi.mocked(getCache).mockResolvedValue(null);
  });

  it("returns 401 when no token is provided", async () => {
    vi.mocked(getAuthUser).mockImplementation(() => { throw new Error("Unauthorized:No token provided"); });
    const req = makeRequest();
    const res = await GET(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toMatch(/Unauthorized/i);
  });

  it("returns 401 when token is invalid", async () => {
    vi.mocked(getAuthUser).mockImplementation(() => { throw new Error("Unauthorized: Invalid token session"); });
    const req = makeRequest("token=invalid-token");
    const res = await GET(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toMatch(/Unauthorized/i);
  });

  it("returns cached profile when available", async () => {
    vi.mocked(getAuthUser).mockReturnValue({ userId: "u1", username: "testuser" });
    const cachedProfile = { id: "u1", username: "testuser", email: "test@example.com" };
    vi.mocked(getCache).mockResolvedValue(cachedProfile);

    const req = makeRequest("token=valid-token");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.profile).toEqual(cachedProfile);
  });

  it("returns profile from DB when not cached", async () => {
    vi.mocked(getAuthUser).mockReturnValue({ userId: "u1", username: "testuser" });
    const dbProfile = {
      id: "u1",
      username: "testuser",
      email: "test@example.com",
      _count: { followedBy: 5, following: 3, blogs: 10 },
    };
    vi.mocked(prisma.user.findUnique).mockResolvedValue(dbProfile as any);

    const req = makeRequest("token=valid-token");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.profile.followersCount).toBe(5);
    expect(data.profile.followingCount).toBe(3);
    expect(data.profile.postsCount).toBe(10);
    expect(setCache).toHaveBeenCalled();
  });

  it("returns 404 when user not found in DB", async () => {
    vi.mocked(getAuthUser).mockReturnValue({ userId: "u1", username: "testuser" });
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const req = makeRequest("token=valid-token");
    const res = await GET(req);
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.success).toBe(false);
  });
});
