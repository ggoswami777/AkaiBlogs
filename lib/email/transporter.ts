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
  service: "gmail",
  auth: {
    user: gmailUser,
    pass: gmailPass,
  },
});

export const emailFrom = {
  name: process.env.EMAIL_FROM_NAME || "AkaiBlogs",
  address: gmailUser,
};
