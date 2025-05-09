import nodemailer from "nodemailer";
import config from "../config/index.js";

export async function sendMail(to, link) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: config.email,
        pass: config.app_password,
      },
    });

    await transporter.sendMail({
      from: config.email, // sender address
      to, // list of receivers
      subject: "Reset your password", // Subject line
      html: `<p>Your password reset link: <a href="${link}">Reset link</a></p>`, // html body
    });
  } catch (error) {
    next(error);
  }
}
