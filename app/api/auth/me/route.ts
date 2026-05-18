import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/authHelper";

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    return NextResponse.json({ success: true, username: user.username });
  } catch (error) {
    return NextResponse.json({ success: false, username: "Guest" }, { status: 401 });
  }
}
