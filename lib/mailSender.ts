import nodemailer from "nodemailer";
import { CustomError } from "./Error";

export const mailSender = async (email: string, html:string, subject:string) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: `${email}`,
      subject: subject,
      html: html
    });

    return info;
  } catch (error) {
    throw new CustomError("Fail to send mail", false, 403);
  }
};
