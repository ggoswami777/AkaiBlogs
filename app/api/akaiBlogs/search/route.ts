import { blogsIndex, usersIndex } from "@/lib/algolia/client";
import { addRecentSearch } from "@/lib/algolia/recentSearches";
import { incrementSearchTrend } from "@/lib/algolia/trendingSearches";
import { getAuthUser } from "@/lib/authHelper";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  try {
    let currentUserId: string | null = null;
    try {
      const activeUserId = getAuthUser(request);
      currentUserId = activeUserId.userId;
    } catch {}
    if (query.trim()) {
      incrementSearchTrend(query).catch((e) =>
        console.error("Error updating trends:", e),
      );
      if (currentUserId) {
        addRecentSearch(currentUserId, query).catch((e) =>
          console.error("Error adding recent search:", e),
        );
      }
    }
    let posts:any[]=[];
    let users:any[]=[];
    let searchSource="algolia";
    try {
      const [blogsResult,usersResult]=await Promise.all([
        blogsIndex.search(query,{hitsPerPage:10}),
        usersIndex.search(query,{hitsPerPage:10})
      ])
       posts = blogsResult.hits.map((hit: any) => ({
        id: hit.objectID,
        title: hit.title,
        excerpt: hit.excerpt || "A newly forged scroll.",
        category: hit.category,
        readTime: "5 min read",
        postImage: hit.coverImage || "https://images.unsplash.com/photo-1542831371-29b0f74f9713",
        author: hit.authorUsername,
        authorImage: hit.authorAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
      }));
      users = usersResult.hits
        .filter((hit: any) => hit.objectID !== currentUserId)
        .map((hit: any) => ({
          id: hit.objectID,
          name: hit.username,
          username: hit.username,
          avatarUrl: hit.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
          isFollowing: false,
        }));
    } catch (algoliaError) {
       console.warn("Algolia failed (possibly rate limited), falling back to Postgres database search.", algoliaError);
       searchSource = "postgres";
        const matchedBlogs = await prisma.blog.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { excerpt: { contains: query, mode: "insensitive" } },
          ],
        },
        include: { author: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      });
      const matchedUsers = await prisma.user.findMany({
        where: {
          OR: [{ username: { contains: query, mode: "insensitive" } }],
          NOT: currentUserId ? { id: currentUserId } : undefined,
        },
        take: 10,
      });
       posts = matchedBlogs.map((blog) => ({
        id: blog.id,
        title: blog.title,
        excerpt: blog.excerpt || "A newly forged scroll.",
        category: blog.category,
        readTime: "5 min read",
        postImage: blog.coverImage || "https://images.unsplash.com/photo-1542831371-29b0f74f9713",
        author: blog.author.username,
        authorImage: blog.author.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
      }));
       users = matchedUsers.map((u) => ({
        id: u.id,
        name: u.username,
        username: u.username,
        avatarUrl: u.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
        isFollowing: false,
      }));
    }
     if (currentUserId && users.length > 0) {
      const userIds = users.map((u) => u.id);
      const followings = await prisma.follows.findMany({
        where: {
          followerId: currentUserId,
          followingId: { in: userIds },
        },
        select: { followingId: true },
      });
      const followingSet = new Set(followings.map((f) => f.followingId));
      users.forEach((u) => {
        u.isFollowing = followingSet.has(u.id);
      });
    }
    return NextResponse.json({ success: true, posts, users, source: searchSource });
  } catch (error) {
     console.error("Search API Error:", error);
    return NextResponse.json({ success: false, error: "Search failed" }, { status: 500 })
  }
}
