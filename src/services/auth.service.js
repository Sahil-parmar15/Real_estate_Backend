const bcrypt = require("bcrypt");
const fs = require("fs");
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');
const { sendResetEmail } = require('../utils/mailer')
const cloudinary = require("../config/cloudinary");
const { User } = require("../models/user.model");
const { Organization } = require("../models/organization.model");
const { verifyOtp , getOtp } = require("../utils/otp");

const createError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const uploadToCloudinary = async (filePath, folder) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    use_filename: true,
    unique_filename: false,
  });
  //fs.unlinkSync(filePath);
  return result.secure_url;
};

exports.registerOrganizationService = async (req) => {
  const {
    name,
    domain,
    address,
    phone,
    username,
    email,
    password,
  } = req.body;

  verifyOtp(email, otp);

  const logoPath = req.files?.logo?.[0]?.path || null;
  const imagePath = req.files?.image?.[0]?.path || null;
  const profilePath = req.files?.profile_picture?.[0]?.path || null;

  const logo = logoPath ? await uploadToCloudinary(logoPath, "logos") : null;
  const image = imagePath ? await uploadToCloudinary(imagePath, "images") : null;
  const profile_picture = profilePath ? await uploadToCloudinary(profilePath, "profile_pictures") : null;

  const orgExists = await Organization.findOne({ where: { name } });
  if (orgExists) throw createError(400, "Organization already registered");

  const organization = await Organization.create({
    name,
    domain,
    address,
    phone,
    logo,
    image,
  });

  const usernameExists = await User.findOne({ where: { username } });
  if (usernameExists) throw createError(400, "Username already registered");

  const emailExists = await User.findOne({ where: { email } });
  if (emailExists) throw createError(400, "Email already registered");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    profile_picture,
    password: hashedPassword,
    role: "OrgAdmin",
    org_id: organization.id,
    status: "Pending",
  });

  return {
    organizationId: organization.id,
    userId: user.id,
    email: user.email,
  };
};

exports.loginService = async ({ email, Username, password }) => {
  const user = await User.findOne({
    where: {
      [Op.or]: [{ email: email } || { username: Username }],
    },
  });

  if (!user) throw createError(401, "User not found");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw createError(401, "Invalid password");

  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "24h" }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "30d" }
  );

  return { accessToken, refreshToken };
};

exports.refreshAccessTokenService = async (refreshToken) => {
  if (!refreshToken) throw createError(401, "No refresh token");

  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return reject(createError(403, "Invalid refresh token"));

      const newAccessToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "24h" }
      );

      resolve(newAccessToken);
    });
  });
};

exports.forgotPasswordService = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw { status: 404, message: "User not found" };

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "15m" });
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  await sendResetEmail(email, resetLink);
};

exports.resetPasswordService = async (token, newPassword) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user) throw { status: 404, message: "User not found" };

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw { status: 400, message: "Reset token has expired" };
    }
    throw error;
  }
};

exports.verifyEmailService = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("token:",decoded);
    

    const user = await User.findByPk(decoded.id);
    if (!user) throw { status: 404, message: "User not found" };

    if (user.email_verified) {
      throw { status: 400, message: "Email is already verified" };
    }

    user.email_verified = true;
    await user.save();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw { status: 400, message: "Verification token has expired" };
    }
    throw { status: 401, message: "Invalid verification token" };
  }
};

exports.verifyOtpService = (email, otp) => {
  
  const storedOtp = getOtp(email);

    if (!storedOtp) {
    throw new Error("OTP not found for this email");
  }

  verifyOtp(email, otp);

  return { message: "OTP verified successfully" };
};

exports.verifyOtpAndRegister = async (req) => {
  const {
    name,
    domain,
    address,
    phone,
    username,
    email,
    password,
    otp
  } = req.body;

  // Step 1: Verify OTP
  verifyOtp(email, otp);

  // Step 2: Handle file uploads
  const logoPath = req.files?.logo?.[0]?.path || null;
  const imagePath = req.files?.image?.[0]?.path || null;
  const profilePath = req.files?.profile_picture?.[0]?.path || null;

  const logo = logoPath ? await uploadToCloudinary(logoPath, "logos") : null;
  const image = imagePath ? await uploadToCloudinary(imagePath, "images") : null;
  const profile_picture = profilePath ? await uploadToCloudinary(profilePath, "profile_pictures") : null;

  // Step 3: Validate uniqueness
  const orgExists = await Organization.findOne({ where: { name } });
  if (orgExists) throw createError(400, "Organization already registered");

  const usernameExists = await User.findOne({ where: { username } });
  if (usernameExists) throw createError(400, "Username already registered");

  const emailExists = await User.findOne({ where: { email } });
  if (emailExists) throw createError(400, "Email already registered");

  // Step 4: Create records
  const hashedPassword = await bcrypt.hash(password, 10);

  const organization = await Organization.create({
    name,
    domain,
    address,
    phone,
    logo,
    image,
  });

  const user = await User.create({
    username,
    email,
    profile_picture,
    password: hashedPassword,
    role: "OrgAdmin",
    org_id: organization.id,
    status: "Pending",
  });

  return {
    organizationId: organization.id,
    userId: user.id,
    email: user.email,
  };
};