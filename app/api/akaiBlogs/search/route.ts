import { getAuthUser } from "@/lib/authHelper";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  try {
    let currentUserId: string | null = null;
    try {
      const activeUser = getAuthUser(request);
      currentUserId = activeUser.userId;
    } catch (error) {}
    const matchedBlogs = await prisma.blog.findMany({
      where: {
        published: true,
        OR: [
          {
            title: { contains: query, mode: "insensitive" },
          },
          {
            excerpt: { contains: query, mode: "insensitive" },
          },
        ],
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });
    const matchedUsers = await prisma.user.findMany({
      where: {
        OR: [
          {
            username: { contains: query, mode: "insensitive" },
          },
          {
            bio: { contains: query, mode: "insensitive" },
          },
        ],
        NOT: currentUserId ? { id: currentUserId } : undefined,
      },
      include: {
        followedBy: true,
      },
      take: 10,
    });
    const posts = matchedBlogs.map((blog) => ({
      id: blog.id,
      title: blog.title,
      excerpt: blog.excerpt || "A newly forged scroll.",
      category: blog.category,
      readTime: "5 min read", // Can be dynamicized later
      postImage:
        blog.coverImage ||
        "https://images.unsplash.com/photo-1542831371-29b0f74f9713",
      author: blog.author.username,
      authorImage:
        blog.author.avatarUrl ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
    }));
    const users = matchedUsers.map((u) => ({
      id: u.id,
      name: u.username, 
      username: u.username,
      avatarUrl:
        u.avatarUrl ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
      isFollowing: currentUserId
        ? u.followedBy.some((follow) => follow.followerId === currentUserId)
        : false,
    }));
    return NextResponse.json({ success: true, posts, users });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { success: false, error: "Search failed" },
      { status: 500 },
    );
  }
}
