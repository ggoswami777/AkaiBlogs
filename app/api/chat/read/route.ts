import { getAuthUser } from "@/lib/authHelper";
import { prisma } from "@/lib/prisma";
import { markReadSchema } from "@/lib/validations/chat";
import { NextRequest, NextResponse } from "next/server";
import {  ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const activeUser = getAuthUser(request);
    const body = await request.json();
    const { conversationId } = markReadSchema.parse(body);
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: activeUser.userId,
        },
      },
    });
    if (!participant) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden",
        },
        { status: 403 },
      );
    }
    const now = new Date();
    await prisma.$transaction([
      prisma.message.updateMany({
        where: {
          conversationId,
          receiverId: activeUser.userId,
        },
        data: {
          readAt: now,
        },
      }),
      prisma.conversationParticipant.update({
        where: {
          conversationId_userId: {
            conversationId,
            userId: activeUser.userId,
          },
        },
        data: {
          lastReadAt: now,
        },
      }),
    ]);
    return NextResponse.json({
      success: true,
      readAt: now,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: error.issues[0]?.message || "Invalid request",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to mark messages as read",
      },
      { status: 500 },
    );
  }
}
