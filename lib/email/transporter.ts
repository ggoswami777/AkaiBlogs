import nodemailer from "nodemailer";

const gmailUser = process.env.GMAIL_USER;
const gmailPass = process.env.GMAIL_APP_PASSWORD;

if (!gmailUser || !gmailPass) {
  throw new Error("Missing GMAIL_USER or GMAIL_APP_PASSWORD env variables");
}

export const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailUser,
    pass: gmailPass,
  },
});

export const emailFrom = {
  name: process.env.EMAIL_FORM_NAME || "AkaiBlogs",
  address: gmailUser,
};
