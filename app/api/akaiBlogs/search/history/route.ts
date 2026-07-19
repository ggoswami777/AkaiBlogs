
import { clearRecentSearches } from "@/lib/algolia/recentSearches";
import { getAuthUser } from "@/lib/authHelper";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const activeUser = getAuthUser(request);
    await clearRecentSearches(activeUser.userId);
    return NextResponse.json({ success: true, message: "History cleared successfully" });
  } catch (error) {
    console.error("Clear history error:", error);
    return NextResponse.json({ success: false, error: "Failed to clear search history" }, { status: 401 });
  }
}
