import { getAuthUser } from "@/lib/authHelper";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const activeUser = getAuthUser(request);
    const notifications = await prisma.notification.findMany({
      where: { receiverId: activeUser.userId },
      include: {
        sender: {
          select: { id: true, username: true, avatarUrl: true }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 20
    });

    const blogIds = notifications
      .filter((n) => (n.type === "LIKE" || n.type === "COMMENT") && n.entityId)
      .map((n) => n.entityId!);

    const blogs = blogIds.length > 0
      ? await prisma.blog.findMany({
          where: { id: { in: blogIds } },
          select: { id: true, title: true, coverImage: true }
        })
      : [];

    const blogMap = new Map(blogs.map((b) => [b.id, b]));

    const enriched = notifications.map((n) => ({
      ...n,
      entityBlog: n.entityId ? blogMap.get(n.entityId) ?? null : null,
    }));

    return NextResponse.json({ success: true, notifications: enriched });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
