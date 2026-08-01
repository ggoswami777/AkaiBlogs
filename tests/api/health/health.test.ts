import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $queryRaw: vi.fn(),
  },
}));

vi.mock("@/lib/redis/redis", () => ({
  getRedisClient: vi.fn(),
}));

import { GET } from "@/app/api/health/route";
import { prisma } from "@/lib/prisma";
import { getRedisClient } from "@/lib/redis/redis";

describe("GET /api/health", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with healthy status when all services are up", async () => {
    vi.mocked(prisma.$queryRaw).mockResolvedValue([{ "?column?": 1 }]);
    const mockRedis = { ping: vi.fn().mockResolvedValue("PONG") };
    vi.mocked(getRedisClient).mockResolvedValue(mockRedis as any);

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("healthy");
    expect(data.checks.database.status).toBe("ok");
    expect(data.checks.redis.status).toBe("ok");
    expect(data.uptime).toBeDefined();
    expect(data.timestamp).toBeDefined();
  });

  it("returns 503 when database is down", async () => {
    vi.mocked(prisma.$queryRaw).mockRejectedValue(new Error("DB connection failed"));
    const mockRedis = { ping: vi.fn().mockResolvedValue("PONG") };
    vi.mocked(getRedisClient).mockResolvedValue(mockRedis as any);

    const res = await GET();
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.status).toBe("degraded");
    expect(data.checks.database.status).toBe("error");
    expect(data.checks.redis.status).toBe("ok");
  });

  it("returns 503 when Redis is down", async () => {
    vi.mocked(prisma.$queryRaw).mockResolvedValue([{ "?column?": 1 }]);
    const mockRedis = { ping: vi.fn().mockRejectedValue(new Error("Redis connection failed")) };
    vi.mocked(getRedisClient).mockResolvedValue(mockRedis as any);

    const res = await GET();
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.status).toBe("degraded");
    expect(data.checks.database.status).toBe("ok");
    expect(data.checks.redis.status).toBe("error");
  });

  it("returns 503 when both services are down", async () => {
    vi.mocked(prisma.$queryRaw).mockRejectedValue(new Error("DB failed"));
    const mockRedis = { ping: vi.fn().mockRejectedValue(new Error("Redis failed")) };
    vi.mocked(getRedisClient).mockResolvedValue(mockRedis as any);

    const res = await GET();
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.status).toBe("degraded");
    expect(data.checks.database.status).toBe("error");
    expect(data.checks.redis.status).toBe("error");
  });
});
