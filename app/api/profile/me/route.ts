import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/authHelper";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { deleteCache, getCache, setCache } from "@/lib/redis/cache";
import { cacheKeys } from "@/lib/redis/cacheKeys";
import { profile } from "console";

export async function GET(request: NextRequest) {
  try {
    const activeUser = getAuthUser(request);
    const cacheKey=cacheKeys.profileMe(activeUser.userId);
    const cachedProfile=await getCache(cacheKey);
    if(cachedProfile){
      return NextResponse.json({
        success:true,
        profile:cachedProfile
      })
    }
    const userProfile = await prisma.user.findUnique({
      where: { username: activeUser.username },
      include: {
        _count: {
          select: { followedBy: true, following: true, blogs: true },
        },
      },
    });

    if (!userProfile) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
    const  profile= {
        ...userProfile,
        followersCount: userProfile._count.followedBy,
        followingCount: userProfile._count.following,
        postsCount: userProfile._count.blogs,
      }
      await setCache(cacheKey,profile,120);
    return NextResponse.json({
      success: true,
      profile
     
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const activeUser = getAuthUser(request);
    const body = await request.json();

    const username =
      typeof body.username === "string" ? body.username.trim() : undefined;

    const bio =
      typeof body.bio === "string" ? body.bio.trim() : undefined;

    const avatarUrl =
      typeof body.avatarUrl === "string" ? body.avatarUrl.trim() : undefined;

    const dataToUpdate: {
      username?: string;
      bio?: string | null;
      avatarUrl?: string | null;
    } = {};

    if (username !== undefined) {
      if (username.length < 3 || username.length > 24) {
        return NextResponse.json(
          { success: false, error: "Username must be 3-24 characters" },
          { status: 400 },
        );
      }

      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return NextResponse.json(
          {
            success: false,
            error: "Username can only contain letters, numbers, and underscores",
          },
          { status: 400 },
        );
      }

      const existingUsername = await prisma.user.findUnique({
        where: { username },
        select: { id: true },
      });

      if (existingUsername && existingUsername.id !== activeUser.userId) {
        return NextResponse.json(
          { success: false, error: "Username already taken" },
          { status: 409 },
        );
      }

      dataToUpdate.username = username;
    }

    if (bio !== undefined) {
      if (bio.length > 250) {
        return NextResponse.json(
          { success: false, error: "Bio must be 250 characters or less" },
          { status: 400 },
        );
      }

      dataToUpdate.bio = bio || null;
    }

    if (avatarUrl !== undefined) {
      if (avatarUrl && !avatarUrl.startsWith("https://")) {
        return NextResponse.json(
          { success: false, error: "Invalid avatar URL" },
          { status: 400 },
        );
      }

      dataToUpdate.avatarUrl = avatarUrl || null;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json(
        { success: false, error: "No profile fields provided" },
        { status: 400 },
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: activeUser.userId },
      data: dataToUpdate,
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        avatarUrl: true,
      },
    });
    await deleteCache(cacheKeys.profileMe(activeUser.userId));
    await deleteCache(cacheKeys.profileMe(activeUser.username));
    if (updatedUser.username !== activeUser.username) {
  await deleteCache(cacheKeys.publicProfile(updatedUser.username));
}
    const response = NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedUser,
    });

    const token = jwt.sign(
      {
        userId: updatedUser.id,
        username: updatedUser.username,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: any) {
    const status = error.message?.includes("Unauthorized") ? 401 : 500;

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update profile",
      },
      { status },
    );
  }
}