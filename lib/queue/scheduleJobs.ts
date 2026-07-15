import { Queue } from "bullmq";
import { bullmqConnection } from "./connection";

export async function registerScheduledJobs() {
    const cleanupQueue=new Queue("cleanup",{connection:bullmqConnection});
    await cleanupQueue.upsertJobScheduler(
        "cleanup-expired-otps",
        {every:60*60*1000},
        {data:{type:"expired_otps"}},
    );
    console.log("Scheduled jobs registered");
}