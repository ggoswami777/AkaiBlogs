import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/authHelper";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const activeUser = getAuthUser(request);
    const {searchParams}=new URL(request.url);
    const username=searchParams.get("username") || activeUser.username
    const blogs = await prisma.blog.findMany({
      where: { author: { username} },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        excerpt: true,
        coverImage: true,
        likesCount: true,
        commentsCount: true,
        createdAt: true,
        category: true,
      },
    });

    return NextResponse.json({ success: true, blogs });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
}
