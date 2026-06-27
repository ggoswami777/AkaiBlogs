import { NextRequest } from "next/server";
import { getRedisClient } from "./redis";

interface RateLimitConfig{
    maxAttempts:number,
    windowSeconds:number
}
export async function checkRateLimit(ip:string,key:string,config:RateLimitConfig):Promise<{allowed:boolean; remaining:number; retryAfter:number}> {
    const redisClient=await getRedisClient();
    const rateLimitKey=`${key}:${ip}`;
    const current=await redisClient.incr(rateLimitKey);
    if(current===1){
        await redisClient.expire(rateLimitKey,config.windowSeconds);
    }
    const ttl=await redisClient.ttl(rateLimitKey);
    const allowed=current<=config.maxAttempts;
    const remaining=Math.max(0,config.maxAttempts-current);
    return{
        allowed,
        remaining,
        retryAfter:ttl>0?ttl:0,
    }
}
export async function resetRateLimit(ip:string,key:string):Promise<void>{
    const redisClient=await getRedisClient();
    const rateLimitKey=`${key}:${ip}`;
    await redisClient.del(rateLimitKey);
    
}
export function getClientIp(request:NextRequest):string{
    const forwarded=request.headers.get('x-forwarded-for');
    const ip=forwarded?forwarded.split(',')[0].trim():'127.0.0.1';
    return ip;
}

