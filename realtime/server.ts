import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { getSocketUser } from "./auth";
import type { ClientToServerEvents, ServerToClientEvents } from "../types/chat";
import { prisma } from "@/lib/prisma";
import z, { safeParse } from "zod";

// zod stuff

const messageSendSchema = z
  .object({
    conversationId: z.string().min(1),
    receiverId: z.string().min(1),
    content: z.string().optional(),
    sharedBlogId: z.string().optional(),
  })
  .refine((data) => data.content?.trim() || data.sharedBlogId, {
    message: "Message must contain text or a shared blog",
  });
const conversationEventSchema = z.object({
  conversationId: z.string().min(1),
});
const typingEventSchema = z.object({
  conversationId: z.string().min(1),
  receiverId: z.string().min(1),
});
const PORT = Number(process.env.SOCKET_PORT || 4000);
const CLIENT_ORIGIN =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const httpServer = createServer();
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
  },
});

const pubClient = createClient({
  url: REDIS_URL,
});

const subClient = pubClient.duplicate();

async function bootstrap() {
  await pubClient.connect();
  await subClient.connect();

  io.adapter(createAdapter(pubClient, subClient));

  io.use((socket, next) => {
    const user = getSocketUser(socket.handshake.headers.cookie);
    if (!user) {
      next(new Error("Unauthorized"));
      return;
    }
    socket.data.user = user;
    next();
  });

  io.on("connection", async (socket) => {
    const user = socket.data.user as { userId: string; username: string };
    socket.join(`user:${user.userId}`);
    await pubClient.sAdd("presence:online-users", user.userId);
    await pubClient.set(`presence:user:${user.userId}`, "online", {
      EX: 60,
    });

    socket.broadcast.emit("presence:online", {
      userId: user.userId,
    });

    const presenceHeartbeat = setInterval(async () => {
      await pubClient.set(`presence:user:${user.userId}`, "online", {
        EX: 60,
      });
    }, 30000);

    socket.on("conversation:join", async (payload) => {
      const parsed = conversationEventSchema.safeParse(payload);
      if (!parsed.success) return;
      
      const { conversationId } = parsed.data;

      const participant = await prisma.conversationParticipant.findUnique({
        where: {
          conversationId_userId: {
            conversationId,
            userId: user.userId,
          },
        },
      });

      if (!participant) {
        return;
      }

      socket.join(`conversation:${conversationId}`);
    });

    socket.on("message:send", async (payload, callback) => {
      const parsed=messageSendSchema.safeParse(payload);
      if(!parsed.success){
        return callback({success:false,error:parsed.error.issues[0].message});
      }
      const validPayload=parsed.data;
      try {
        const participant = await prisma.conversationParticipant.findUnique({
          where: {
            conversationId_userId: {
              conversationId: validPayload.conversationId,
              userId: user.userId,
            },
          },
        });
        if (!participant) {
          callback({
            success: false,
            error: "Forbidden",
          });
          return;
        }

        const receiverParticipant =
          await prisma.conversationParticipant.findUnique({
            where: {
              conversationId_userId: {
                conversationId: validPayload.conversationId,
                userId: validPayload.receiverId,
              },
            },
          });
        if (!receiverParticipant) {
          callback({
            success: false,
            error: "Receiver is not in this conversation",
          });
          return;
        }
        if (!validPayload.content?.trim() && !validPayload.sharedBlogId) {
          callback({
            success: false,
            error: "Message must contain text or a shared blog",
          });
          return;
        }
        if (validPayload.sharedBlogId) {
          const blog = await prisma.blog.findUnique({
            where: {
              id: validPayload.sharedBlogId,
            },
            select: {
              id: true,
            },
          });
          if (!blog) {
            callback({
              success: false,
              error: "Shared blog not found",
            });
            return;
          }
        }
        const receiverOnline = await pubClient.get(
          `presence:user:${validPayload.receiverId}`,
        );
        const message = await prisma.message.create({
          data: {
            conversationId: validPayload.conversationId,
            senderId: user.userId,
            receiverId: validPayload.receiverId,
            content: validPayload.content?.trim() || null,
            sharedBlogId: validPayload.sharedBlogId || null,
            deliveredAt: receiverOnline === "online" ? new Date() : null,
          },
          include: {
            sharedBlog: {
              select: {
                id: true,
                title: true,
                excerpt: true,
                coverImage: true,
                author: {
                  select: {
                    username: true,
                  },
                },
              },
            },
          },
        });
        await prisma.conversation.update({
          where: {
            id: validPayload.conversationId,
          },
          data: {
            updatedAt: new Date(),
          },
        });
        const serializedMessage = {
          ...message,
          createdAt: message.createdAt.toISOString(),
          deliveredAt: message.deliveredAt?.toISOString() || null,
          readAt: message.readAt?.toISOString() || null,
        };

        io.to(`conversation:${validPayload.conversationId}`).emit(
          "message:new",
          serializedMessage,
        );

        io.to(`user:${validPayload.receiverId}`).emit(
          "message:new",
          serializedMessage,
        );

        if (message.deliveredAt) {
          io.to(`user:${user.userId}`).emit("message:delivered", {
            messageId: message.id,
            deliveredAt: message.deliveredAt.toISOString(),
          });
        }
        callback({
          success: true,
          message: serializedMessage,
        });
      } catch (error) {
        console.error("Error sending message:", error);
        callback({
          success: false,
          error: "Failed to send message",
        });
      }
    });
    socket.on("message:read", async (payload) => {
      const parsed = conversationEventSchema.safeParse(payload);
      if (!parsed.success) return;
      
      const { conversationId } = parsed.data;

      const participant = await prisma.conversationParticipant.findUnique({
        where: {
          conversationId_userId: {
            conversationId,
            userId: user.userId,
          },
        },
      });
      if (!participant) {
        return;
      }
      const readAt = new Date();
      await prisma.$transaction([
        prisma.message.updateMany({
          where: {
            conversationId,
            receiverId: user.userId,
            readAt: null,
          },
          data: {
            readAt,
          },
        }),

        prisma.conversationParticipant.update({
          where: {
            conversationId_userId: {
              conversationId,
              userId: user.userId,
            },
          },
          data: {
            lastReadAt: readAt,
          },
        }),
      ]);

      io.to(`conversation:${conversationId}`).emit("message:read", {
        conversationId,
        readerId: user.userId,
        readAt: readAt.toISOString(),
      });
    });
    socket.on("typing:start", (payload) => {
      const parsed = typingEventSchema.safeParse(payload);
      if (!parsed.success) return;
      const { conversationId, receiverId } = parsed.data;

      io.to(`user:${receiverId}`).emit("typing:start", {
        conversationId,
        userId: user.userId,
      });
    });
    socket.on("typing:stop", (payload) => {
      const parsed = typingEventSchema.safeParse(payload);
      if (!parsed.success) return;
      const { conversationId, receiverId } = parsed.data;

      io.to(`user:${receiverId}`).emit("typing:stop", {
        conversationId,
        userId: user.userId,
      });
    });
    socket.on("disconnect", async () => {
      clearInterval(presenceHeartbeat);

      const userSockets = await io.in(`user:${user.userId}`).fetchSockets();

      if (userSockets.length === 0) {
        await pubClient.sRem("presence:online-users", user.userId);
        await pubClient.del(`presence:user:${user.userId}`);

        socket.broadcast.emit("presence:offline", {
          userId: user.userId,
        });
      }
    });
  });
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Socket server running on http://0.0.0.0:${PORT}`);
  });
}
bootstrap().catch((error) => {
  console.error("Socket server failed to start:", error);
  process.exit(1);
});
