import nodemailer from "nodemailer";
import { env } from "../config/env";
import { otpEmailTemplate } from "./auth.template";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export async function sendOtpEmail(to: string, code: string, name?: string) {
  const { html, text } = otpEmailTemplate({ code, name, expiresInMinutes: 10 });

  return transporter.sendMail({
    from: env.MAIL_FROM,
    to,
    subject: `${code} is your StockFlow verification code`,
    html,
    text,
  });
}
