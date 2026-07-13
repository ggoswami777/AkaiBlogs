import { ConnectionOptions } from "bullmq";

export const bullmqConnection :ConnectionOptions={
    host:process.env.REDIS_URL?.replace("redis://","").split(":")[0] || "localhost",
    port:parseInt(process.env.REDIS_URL?.split(":")[2] || "6379"),
};