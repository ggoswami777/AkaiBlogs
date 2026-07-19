import { getRedisClient } from "../redis/redis";

const TRENDING_KEY="search:trending";
export async function incrementSearchTrend(query: string) {
  const redis = await getRedisClient();
  const normalized = query.toLowerCase().trim();
  await redis.zIncrBy(TRENDING_KEY, 1, normalized);
}

export async function getTrendingSearches(limit = 10): Promise<string[]> {
  const redis = await getRedisClient();
  return redis.zRange(TRENDING_KEY, 0, limit - 1, { REV: true });
}