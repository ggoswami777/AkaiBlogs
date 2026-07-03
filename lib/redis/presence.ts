import { getRedisClient } from "@/lib/redis/redis";

const ONLINE_USERS_KEY = "presence:online-users";

export async function markUserOnline(userId: string) {
  const redis = await getRedisClient();

  await redis.sAdd(ONLINE_USERS_KEY, userId);

  await redis.set(`presence:user:${userId}`, "online", {
    EX: 60,
  });
}

export async function refreshUserPresence(userId: string) {
  const redis = await getRedisClient();

  await redis.set(`presence:user:${userId}`, "online", {
    EX: 60,
  });
}

export async function markUserOffline(userId: string) {
  const redis = await getRedisClient();

  await redis.sRem(ONLINE_USERS_KEY, userId);
  await redis.del(`presence:user:${userId}`);
}

export async function isUserOnline(userId: string) {
  const redis = await getRedisClient();

  const status = await redis.get(`presence:user:${userId}`);
  return status === "online";
}

export async function getOnlineUserIds() {
  const redis = await getRedisClient();

  return redis.sMembers(ONLINE_USERS_KEY);
}