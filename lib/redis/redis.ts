import {createClient} from 'redis';

let redisClient:ReturnType<typeof createClient>|null=null;

export async function getRedisClient(){
    if(redisClient){
        return redisClient;
    }
    redisClient=createClient({
        url:process.env.REDIS_URL || 'redis://localhost:6379',
    });
    redisClient.on('error',(err)=>console.log("Redis Client Error",err));
    await redisClient.connect();
    return redisClient;
}

export async function closeRedis(){
    if(redisClient){
        await redisClient.quit();
        redisClient=null;
    }
}