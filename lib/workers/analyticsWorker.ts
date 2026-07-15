import { Worker,Job } from "bullmq";
import { bullmqConnection } from "../queue/connection";
import { updateUserInterest } from "../feed/updateUserInterest";
import type { AnalyticsJobData } from "../queue/type";

const analyticsWorker=new Worker<AnalyticsJobData>(
    "analytics",
    async(job:Job)=>{
        const {blogId,category,action,userId}=job.data;
        if(userId){
            await updateUserInterest({userId,category,action});
        }
        console.log(`Analytic processed: ${action} on ${blogId}`);
    },
    {connection:bullmqConnection}
)
analyticsWorker.on("failed", (job, err) => {
  console.error(`Analytics job ${job?.id} failed:`, err.message);
});

export default analyticsWorker;