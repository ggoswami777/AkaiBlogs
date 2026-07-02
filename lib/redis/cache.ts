import { getRedisClient } from "./redis";

export async function getCache<T>(key:string):Promise<T | null>{
    const redis=await getRedisClient();
    const cached=await redis.get(key);
    if(!cached){
        return null;
    }
    try {
        return JSON.parse(cached) as T;
    } catch (error) {
        await redis.del(key);
        return null;
    }
}

export async function setCache(
    key:string,
    value:unknown,
    ttlSeconds:number,
){
    const redis=await getRedisClient();
    await redis.set(key,JSON.stringify(value),{
        EX:ttlSeconds,
    });
}

export async function deleteCache(key:string){
    const redis=await getRedisClient();
    await redis.del(key);
}

export async function deleteCacheByPattern(pattern:string){
    const redis=await getRedisClient();
    const keys:string[]=[];
    for await(const key of redis.scanIterator({
        MATCH:pattern,
        COUNT:100,
    })){
        keys.push(String(key));
    }
    if(keys.length>0) await redis.del(keys);
}