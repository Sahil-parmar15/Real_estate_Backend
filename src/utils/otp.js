const otpStore = new Map(); 

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function saveOtp(email, otp) {
    console.log(`Saving OTP for ${email}: ${otp}`);
  otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });
}

function getOtp(email){
    console.log("email:",email);
    return otpStore.get(email);
  };

function verifyOtp(email, otp) {
    console.log(`Verifying OTP for ${email}: ${otp}`);
  const data = otpStore.get(email);
  console.log(otp);
  
  if (!data) throw new Error("OTP expired or invalid");
  if (Date.now() > data.expiresAt) {
    otpStore.delete(email);
    throw new Error("OTP expired");
  }
  if (data.otp !== otp) throw new Error("Invalid OTP");
  otpStore.delete(email);
}

module.exports = { generateOtp, saveOtp, verifyOtp, getOtp };
