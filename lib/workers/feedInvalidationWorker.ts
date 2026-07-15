import { Worker,Job } from "bullmq";
import { bullmqConnection } from "../queue/connection";
import { invalidateAllFeedCaches, invalidateFeedCache } from "../feed/invalidateFeedCache";
import type { FeedInvalidationJobData } from "../queue/type";

const feedInvalidationWorker=new Worker<FeedInvalidationJobData>(
    "feed-invalidation",
    async(job:Job)=>{
        const {userId,type}=job.data;
        if(type=="all"){
            await invalidateAllFeedCaches();
        }else{
            await invalidateFeedCache(userId);
        }
        console.log(`Feed cache invalidated: ${type}`);
    },
    {connection:bullmqConnection}
)
feedInvalidationWorker.on("failed", (job, err) => {
  console.error(`Feed invalidation job ${job?.id} failed:`, err.message);
});

export default feedInvalidationWorker;