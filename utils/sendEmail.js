import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, text) => {
  try {

    await transporter.sendMail({
      from: `"Codeflame Technology" <no-reply@codeflametechnology.com>`,
      to,
      subject,
      html: text,
    });

  } catch (error) {
    console.log("Error sending email:", error);
  }
};