const { registerOrganizationService,
        loginService,
        refreshAccessTokenService,
        forgotPasswordService,
        resetPasswordService,
        verifyEmailService,
        verifyOtpService,
        verifyOtpAndRegister
 } = require("../services/auth.service");
const { sendOtpToEmail } = require("../services/otp.service");

exports.registerOrganization = async (req, res) => {
  try {
    const result = await registerOrganizationService(req);
    res.status(201).json({
      success: true,
      message: "Organization registered successfully",
      data: result,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { accessToken, refreshToken } = await loginService(req.body);

      res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, accessToken });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const newAccessToken = await refreshAccessTokenService(req.cookies.refreshToken);

    res.status(200).json({ success: true, accessToken: newAccessToken });
  } catch (err) {
    res.status(err.status || 401).json({ success: false, message: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await forgotPasswordService(email);
    res.status(200).json({ success: true, message: "Reset link sent to email." });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match",
      });
    }

    await resetPasswordService(token, password);

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: "Token is required" });
    }

    await verifyEmailService(token);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Email verification failed",
    });
  }
};

exports.sendOrgRegistrationOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await sendOtpToEmail(email);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const result = await verifyOtpService(email, otp);

    return res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    console.error("Error during OTP verification:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await sendOtpToEmail(email);
    res.status(200).json({ success: true, message: "OTP resent", data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyOtpAndRegisterOrganization = async (req, res) => {
  try {
    const result = await verifyOtpAndRegister(req);
    res.status(201).json({ success: true, message: "Organization registered successfully", ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


