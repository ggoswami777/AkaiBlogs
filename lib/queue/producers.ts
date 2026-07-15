import { analyticsQueue, cleanupQueue, feedInvalidationQueue, otpEmailQueue } from "./queue";

import type { OtpEmailJobData,FeedInvalidationJobData,AnalyticsJobData,CleanupJobData } from "./type";

export async function addOtpEmailJob(data:OtpEmailJobData) {
    await otpEmailQueue.add("send-otp",data,{
        attempts:3,
        backoff:{type:"exponential",delay:2000},
        removeOnComplete:true,
        removeOnFail:100,
    })
}

export async function addFeedInvalidationJob(data:FeedInvalidationJobData){
    await feedInvalidationQueue.add("invalidate",data,{
        attempts:2,
        removeOnComplete:true,
    })
}
export async function addAnalyticsJob(data:AnalyticsJobData){
    await analyticsQueue.add("process",data,{
        attempts:2,
        removeOnComplete:true,
    })
}

export async function addCleanJob(data:CleanupJobData){
    await cleanupQueue.add("cleanup",data,{
        removeOnComplete:true,
    })
}
