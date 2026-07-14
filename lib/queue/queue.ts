import { Queue } from "bullmq";
import { bullmqConnection } from "./connection";

const commonOpts={connection:bullmqConnection};

export const otpEmailQueue=new Queue("otp-email",commonOpts);
export const feedInvalidationQueue=new Queue("feed-invalidation",commonOpts);
export const analyticsQueue=new Queue("analytics",commonOpts);
export const cleanupQueue=new Queue("cleanup",commonOpts);