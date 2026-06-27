import nodemailer from "nodemailer";

const requiredEnv = {
  gmailUser: process.env.GMAIL_USER,
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
};
for(const[key,value] of Object.entries(requiredEnv)){
    if(!value){
        throw new Error(`Missing email env variable: ${key}`);
    }
}
export const emailTransporter=nodemailer.createTransport({
     service: "gmail",
  auth: {
    type: "OAuth2",
    user: requiredEnv.gmailUser,
    clientId: requiredEnv.clientId,
    clientSecret: requiredEnv.clientSecret,
    refreshToken: requiredEnv.refreshToken,
  },
})

export const emailFrom={
    name:process.env.EMAIL_FORM_NAME || "AkaiBlogs",
    address:requiredEnv.gmailUser as string,
}
