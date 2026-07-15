import Redis from "ioredis";

export const redisConnectionInstance = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null, 
}) as any;

export const bullmqConnection = redisConnectionInstance;

