import nodemailer from "nodemailer";

const gmailUser = process.env.GMAIL_USER;
const gmailPass = process.env.GMAIL_APP_PASSWORD;

if (!gmailUser) {
  throw new Error("Missing GMAIL_USER env variable");
}

if (!gmailPass) {
  throw new Error("Missing GMAIL_APP_PASSWORD env variable");
}

export const emailTransporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: gmailUser,
    pass: gmailPass,
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000,
});

export const emailFrom = {
  name: process.env.EMAIL_FROM_NAME || "AkaiBlogs",
  address: gmailUser,
};
