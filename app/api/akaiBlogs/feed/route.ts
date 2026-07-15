import { NextRequest, NextResponse } from "next/server";
import { getAuthUserServer } from "@/lib/authHelper";
import { getCache } from "@/lib/redis/cache";
import { cacheKeys } from "@/lib/redis/cacheKeys";
import { recomputeFeedForUser } from "@/lib/feed/recomputeFeed";

export async function GET(request: NextRequest) {
  try {
    const activeUser = await getAuthUserServer();
    const userId = activeUser?.userId;
    const cacheKey = userId ? cacheKeys.userFeed(userId) : cacheKeys.guestFeed;

    const cacheFeed = await getCache<any>(cacheKey);
    if (cacheFeed) {
      return NextResponse.json(cacheFeed);
    }

    const responsePayload = await recomputeFeedForUser(userId ?? null);
    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error("Feed API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch feed" },
      { status: 500 }
    );
  }
}
