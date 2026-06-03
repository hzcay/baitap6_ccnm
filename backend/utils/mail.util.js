const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendOTPEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Mã OTP kích hoạt tài khoản",
      html: `
        <h3>Kích hoạt tài khoản</h3>
        <p>Mã OTP của bạn là:</p>
        <h2>${otp}</h2>
        <p>Mã này sẽ hết hạn sau 5 phút.</p>
      `,
    });
  } catch (error) {
    console.log("--------------------------------------------------");
    console.log(`[LOCAL DEV FALLBACK] Failed to send email via SMTP.`);
    console.log(`OTP Code for ${email} is: ${otp}`);
    console.log("--------------------------------------------------");
  }
};

const sendForgotPasswordOTPEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Mã OTP đặt lại mật khẩu",
      html: `
        <h3>Đặt lại mật khẩu</h3>
        <p>Mã OTP của bạn là:</p>
        <h2>${otp}</h2>
        <p>Mã này sẽ hết hạn sau 5 phút.</p>
      `,
    });
  } catch (error) {
    console.log("--------------------------------------------------");
    console.log(`[LOCAL DEV FALLBACK] Failed to send email via SMTP.`);
    console.log(`Forgot Password OTP Code for ${email} is: ${otp}`);
    console.log("--------------------------------------------------");
  }
};

module.exports = {
  sendOTPEmail,
  sendForgotPasswordOTPEmail,
};