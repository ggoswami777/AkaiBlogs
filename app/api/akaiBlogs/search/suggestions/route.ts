import { getRecentSearches } from "@/lib/algolia/recentSearches";
import { getTrendingSearches } from "@/lib/algolia/trendingSearches";
import { getAuthUser } from "@/lib/authHelper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    let userId: string | null = null;
    try {
      const user = getAuthUser(request);
      userId = user.userId;
    } catch {}
    const [recent, trending] = await Promise.all([
      userId ? getRecentSearches(userId) : Promise.resolve([]),
      getTrendingSearches(8),
    ]);
    return NextResponse.json({ success: true, recent, trending });
  } catch (error) {
    console.error("Suggestions error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch suggestions" },
      { status: 500 },
    );
  }
}
