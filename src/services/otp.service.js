const { sendMail } = require("../utils/mailer");
const { generateOtp, saveOtp } = require("../utils/otp");

exports.sendOtpToEmail = async (email) => {
  const otp = generateOtp();
  saveOtp(email, otp);

  const mailOptions = {
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
  };

  await sendMail(mailOptions);
  return { message: "OTP sent to email" };
};
