import { getAuthUser } from "@/lib/authHelper";
import { getOrCreateConversation } from "@/lib/chat/getOrCreateConversation";
import { prisma } from "@/lib/prisma";
import { createConservationSchema } from "@/lib/validations/chat";
import { NextRequest, NextResponse } from "next/server";
import { success, ZodError } from "zod";

export async function GET(request: NextRequest) {
  try {
    const activeUser = getAuthUser(request);
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: activeUser.userId,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          include: {
            sharedBlog: {
              select: {
                id: true,
                title: true,
                coverImage: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    const formatted = conversations.map((conversation) => {
      const otherParticipant = conversation.participants.find(
        (participant) => participant.userId !== activeUser.userId,
      );
      const unreadCountPromise = prisma.message.count({
        where: {
          conversationId: conversation.id,
          receiverId: activeUser.userId,
          readAt: null,
        },
      });
      return {
        id: conversation.id,
        otherUser: otherParticipant?.user,
        lastMessage: conversation.messages[0] || null,
        unreadCountPromise,
        updatedAt: conversation.updatedAt,
      };
    });
    const withUnreadCounts = await Promise.all(
      formatted.map(async (item) => ({
        id: item.id,
        otherUser: item.otherUser,
        lastMessage: item.lastMessage,
        unreadCount: await item.unreadCountPromise,
        updatedAt: item.updatedAt,
      })),
    );
    return NextResponse.json({
      success: true,
      conversations: withUnreadCounts,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch conversations",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const activeUser = getAuthUser(request);
    const body = await request.json();
    const { receiverId } = createConservationSchema.parse(body);
    const receiver = await prisma.user.findUnique({
      where: {
        id: receiverId,
      },
      select: {
        id: true,
      },
    });
    if (!receiver) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 },
      );
    }
    const conversation = await getOrCreateConversation({
      currentUserId: activeUser.userId,
      receiverId,
    });
    return NextResponse.json({
      success: true,
      conversation,
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
        error:
          error instanceof Error
            ? error.message
            : "Failed to create conversation",
      },
      { status: 500 },
    );
  }
}
