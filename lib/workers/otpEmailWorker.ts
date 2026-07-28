import {Worker,Job} from "bullmq"
import { redisConnectionInstance } from "../queue/connection"
import { sendOtpEmail } from "../email/sendOtpEmail"
import type { OtpEmailJobData } from "../queue/type"

const otpEmailWorker=new Worker<OtpEmailJobData>(
    "otp-email",
    async(job:Job)=>{
        const {email,username,otp,expiryMinutes}=job.data;
        console.log(`Processing OTP email job ${job.id} for ${email}`);
        await sendOtpEmail({email,username,otp,expiryMinutes});
       
    },
    {connection:redisConnectionInstance as any}
);
otpEmailWorker.on("completed",(job)=>{
    console.log(`OTP email job ${job.id} completed`);
})
otpEmailWorker.on("failed",(job,err)=>{
    console.error(`OTP email job ${job?.id} failed:`,err);
})
export default otpEmailWorker;
