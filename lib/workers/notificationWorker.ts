import { Worker, Job } from "bullmq";
import { redisConnectionInstance } from "../queue/connection";
import { prisma } from "../prisma";
import type { NotificationJobData } from "../queue/type";

const notificationWorker = new Worker<NotificationJobData>(
  "notifications",
  async (job: Job) => {
    const { type, senderId, receiverId, entityId } = job.data;

    const notification = await prisma.notification.create({
      data: { type, senderId, receiverId, entityId },
      include: {
        sender: {
          select: { username: true, avatarUrl: true }
        }
      }
    });

    let entityBlog: { id: string; title: string; coverImage: string | null } | null = null;
    if ((type === "LIKE" || type === "COMMENT") && entityId) {
      entityBlog = await prisma.blog.findUnique({
        where: { id: entityId },
        select: { id: true, title: true, coverImage: true }
      });
    }

    const pubClient = redisConnectionInstance;
    await pubClient.publish(
      "notifications:dispatch",
      JSON.stringify({
        receiverId,
        notification: {
          ...notification,
          createdAt: notification.createdAt.toISOString(),
          entityBlog,
        }
      })
    );
  },
  { connection: redisConnectionInstance }
);

export default notificationWorker;
