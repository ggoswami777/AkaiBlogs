import { otpEmailTemplate } from "./templates";
import { emailFrom, emailTransporter } from "./transporter";
type SendOtpEmailInput={
    email:string;
    username:string;
    otp:string;
    expiryMinutes:number;
}
export async function sendOtpEmail({
    email,
    username,
    otp,
    expiryMinutes
}:SendOtpEmailInput){
    const template=otpEmailTemplate({
        username,
        otp,
        expiryMinutes,
    });

    const info = await emailTransporter.sendMail({
        from:emailFrom,
        to:email,
        subject:template.subject,
        text:template.text,
        html:template.html,
    })

    console.log(`OTP email sent to ${email}. Message id: ${info.messageId}`);
}
