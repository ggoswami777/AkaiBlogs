
import { Queue } from "bullmq";
import { redisConnectionInstance } from "./connection";

const commonOpts = { connection: redisConnectionInstance };



export const otpEmailQueue=new Queue("otp-email",commonOpts);
export const feedInvalidationQueue=new Queue("feed-invalidation",commonOpts);
export const analyticsQueue=new Queue("analytics",commonOpts);
export const cleanupQueue=new Queue("cleanup",commonOpts);
export const notificationQueue = new Queue("notifications", commonOpts);
