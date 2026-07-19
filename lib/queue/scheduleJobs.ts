import { Queue } from "bullmq";
import { bullmqConnection } from "./connection";

export async function registerScheduledJobs() {
    const cleanupQueue=new Queue("cleanup",{connection:bullmqConnection});
    await cleanupQueue.upsertJobScheduler(
        "cleanup-expired-otps",
        {every:60*60*1000},
        {data:{type:"expired_otps"}},
    );
    await cleanupQueue.upsertJobScheduler(
        "update-trending-scores",
        {every:60*1000},
        {data:{type:"trending_scores"}},
    )
    await cleanupQueue.upsertJobScheduler(
        "cleanup-search-trends",
        {every:24*60*60*1000},
        {data:{type:"search_trends"}},
    )
    console.log("Scheduled jobs registered");
}