import nodemailer from "nodemailer";

const brevoUser = process.env.BREVO_USER;
const brevoPass = process.env.BREVO_PASS;

if (!brevoUser || !brevoPass) {
  throw new Error("Missing BREVO_USER or BREVO_PASS env variables");
}

export const emailTransporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: brevoUser,
    pass: brevoPass,
  },
});

export const emailFrom = {
  name: process.env.EMAIL_FROM_NAME || "AkaiBlogs",
  address: brevoUser,
};
