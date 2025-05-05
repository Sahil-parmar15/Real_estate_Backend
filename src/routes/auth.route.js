const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const { registerOrganization,
        login,
        refreshToken,
        logout,
        forgotPassword,
        resetPassword,
        verifyEmail,
        sendOrgRegistrationOtp,
        verifyOtp,
        resendOtp,
        verifyOtpAndRegisterOrganization,
 } = require("../controllers/auth.controller");

router.post('/send-org-otp', sendOrgRegistrationOtp);
router.post("/register", 
  upload.fields([
    { name: "profile_picture", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "image", maxCount: 1 }
  ]),
  verifyOtpAndRegisterOrganization
);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-email', verifyEmail);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);


module.exports = router;
