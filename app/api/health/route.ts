import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRedisClient } from "@/lib/redis/redis";

export async function GET() {
  const checks: Record<string, { status: string; latencyMs?: number }> = {};

  // Database check
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    checks.database = { status: "ok", latencyMs: Date.now() - start };
  } catch {
    checks.database = { status: "error" };
  }

  // Redis check
  try {
    const start = Date.now();
    const redis = await getRedisClient();
    await redis.ping();
    checks.redis = { status: "ok", latencyMs: Date.now() - start };
  } catch {
    checks.redis = { status: "error" };
  }

  const allHealthy = Object.values(checks).every((c) => c.status === "ok");

  return NextResponse.json(
    {
      status: allHealthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks,
    },
    { status: allHealthy ? 200 : 503 }
  );
}