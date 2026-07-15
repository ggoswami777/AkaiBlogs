import {Worker,Job} from "bullmq"
import { redisConnectionInstance } from "../queue/connection"
import { sendOtpEmail } from "../email/sendOtpEmail"
import type { OtpEmailJobData } from "../queue/type"

const otpEmailWorker=new Worker<OtpEmailJobData>(
    "otp-email",
    async(job:Job)=>{
        const {email,username,otp,expiryMinutes}=job.data;
        await sendOtpEmail({email,username,otp,expiryMinutes});
        // send otp from here 
    },
    {connection:redisConnectionInstance}
);
otpEmailWorker.on("failed",(job,err)=>{
    console.error(`OTP email job ${job?.id} failed:`,err.message);
})
export default otpEmailWorker;