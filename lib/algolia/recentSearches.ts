import { getRedisClient } from "../redis/redis";

const RECENT_SEARCHES_KEY="search:recent";
const MAX_RECENT=20;

export async function addRecentSearch(userId:string,query:string) {
    const redis=await getRedisClient();
    const key=`${RECENT_SEARCHES_KEY}:${userId}`;
    await redis.lRem(key,0,query);
    await redis.lPush(key,query);
    await redis.lTrim(key,0,MAX_RECENT-1);
}

export async function getRecentSearches(userId:string):Promise<string[]> {
     const redis=await getRedisClient();
     const key=`${RECENT_SEARCHES_KEY}:${userId}`;
     return redis.lRange(key,0,-1);
}

export async function clearRecentSearches(userId:string) {
    const redis=await getRedisClient();
    await redis.del(`${RECENT_SEARCHES_KEY}:${userId}`);
}