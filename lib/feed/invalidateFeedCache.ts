import { cache } from "react";
import { deleteCache, deleteCacheByPattern } from "../redis/cache";
import { cacheKeys } from "../redis/cacheKeys";

export async function invalidateFeedCache(userId?:string){
    await deleteCache(cacheKeys.guestFeed);
    await deleteCache(cacheKeys.trendingBlogs);
    if(userId){
        await deleteCache(cacheKeys.userFeed(userId));
    }
}

export async function invalidateAllFeedCaches(){
    await deleteCache(cacheKeys.guestFeed);
    await deleteCache(cacheKeys.trendingBlogs);
    await deleteCacheByPattern("feed:user:*");
}