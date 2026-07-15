import {Worker,Job} from "bullmq";
import { bullmqConnection } from "../queue/connection";
import { prisma } from "../prisma";
import type { CleanupJobData } from "../queue/type";
import { getTrendingBlogs } from "../feed/getTrendingBlogs";

const cleanupWorker=new Worker<CleanupJobData>(
    "cleanup",
    async(job:Job)=>{
        const {type}=job.data;
        if(type==="expired_otps"){
            const result=await prisma.oTPVerification.deleteMany({
                where:{otpExpiry:{lt:new Date()}},
            });
            console.log(`Cleaned ${result.count} expired OTPs`);
        }else if(type==="trending_scores"){
            await getTrendingBlogs();
             console.log("Trending scores updated asynchronously");
        }
    },
    {connection:bullmqConnection}
)

cleanupWorker.on("failed",(job,err)=>{
    console.error(`Cleanup job ${job?.id} failed:`,err.message);
});

export default cleanupWorker;