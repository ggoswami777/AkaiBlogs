import { getAuthUserServer } from "@/lib/authHelper";
import { prisma } from "@/lib/prisma";
import { getCache, setCache } from "@/lib/redis/cache";
import { cacheKeys } from "@/lib/redis/cacheKeys";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const { username } = await params;
    const activeUser = await getAuthUserServer();
    const cacheKey = cacheKeys.publicProfile(username);
    const cachedProfile = await getCache<{
      id: string;
      username: string;
      bio: string | null;
      avatarUrl: string | null;
      followersCount: number;
      followingCount: number;
      postsCount: number;
    }>(cacheKey);
    if (cachedProfile) {
      const followRelation = activeUser?.userId
        ? await prisma.follows.findUnique({
            where: {
              followerId_followingId: {
                followerId: activeUser.userId,
                followingId: cachedProfile.id,
              },
            },
          })
        : null;
      return NextResponse.json({
        success: true,
        profile: {
          ...cachedProfile,
          isFollowing: Boolean(followRelation),
        },
      });
    }
    if (!activeUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    const targetUser = await prisma.user.findUnique({
      where: { username },
      include: {
        _count: {
          select: {
            followedBy: true,
            following: true,
            blogs: true,
          },
        },
      },
    });
    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }
    let isFollowing = false;
    if (activeUser) {
      const followRelation = await prisma.follows.findUnique({
        where: {
          followerId_followingId: {
            followerId: activeUser.userId,
            followingId: targetUser.id,
          },
        },
      });
      isFollowing = !!followRelation;
    }

    const publicProfile = {
      id: targetUser.id,
      username: targetUser.username,
      bio: targetUser.bio,
      avatarUrl: targetUser.avatarUrl,
      followersCount: targetUser._count.followedBy,
      followingCount: targetUser._count.following,
      postsCount: targetUser._count.blogs,
    };

    await setCache(cacheKey, publicProfile, 120);

    return NextResponse.json({
      success: true,
      profile: {
        ...publicProfile,
        isFollowing,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch profile",
      },
      { status: 500 },
    );
  }
}
