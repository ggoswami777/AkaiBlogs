import { getAuthUserServer } from "@/lib/authHelper";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const { username } = await params;
    const activeUser = await getAuthUserServer(); // FIX 1: was missing `await`
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

    return NextResponse.json({
      success: true,
      profile: {
        id: targetUser.id,
        username: targetUser.username,
        bio: targetUser.bio,
        avatarUrl: targetUser.avatarUrl,
        followersCount: targetUser._count.followedBy,
        followingCount: targetUser._count.following,
        postsCount: targetUser._count.blogs,
        isFollowing,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch profile" },
      { status: 500 },
    );
  }
}
