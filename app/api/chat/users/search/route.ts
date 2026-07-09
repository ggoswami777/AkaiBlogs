import { getAuthUser } from "@/lib/authHelper";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";

export async function GET(request: NextRequest) {
  try {
    const activeUser = getAuthUser(request);
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "";
    if (query.length < 2) {
      return NextResponse.json({
        success: true,
        users: [],
      });
    }
    const users = await prisma.user.findMany({
      where: {
        id: {
          not: activeUser.userId,
        },
        OR: [
          {
            username: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            bio: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        bio: true,
      },
      take: 10,
    });
    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search users",
      },
      { status: 500 },
    );
  }
}
