const { Organization } = require("../models/organization.model");
const { User } = require("../models/user.model");
const cloudinary = require("../config/cloudinary");
const { sendMail } = require("../utils/mailer");
const jwt = require("jsonwebtoken");

const uploadToCloudinary = async (filePath, folder) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    use_filename: true,
    unique_filename: false,
  });
  //fs.unlinkSync(filePath);
  return result.secure_url;
};

exports.getOrgProfileService = async (orgId) => {
    console.log("Requested Org ID:", orgId);
  const org = await Organization.findByPk(orgId);
  if (!org) throw new Error("Organization not found");
  return org;
};

exports.updateOrgProfileService = async (orgId, data, files) => {
  const org = await Organization.findByPk(orgId);
  if (!org) throw new Error("Organization not found");

  const logoPath = files?.logo?.[0]?.path || null;
  const imagePath = files?.image?.[0]?.path || null;

  const logo = logoPath ? await uploadToCloudinary(logoPath, "logos") : null;
  const image = imagePath ? await uploadToCloudinary(imagePath, "images") : null;
  
  await org.update({
    name: data.name || org.name,
    domain: data.domain || org.domain,
    address: data.address || org.address,
    phone: data.phone || org.phone,
    logo,
    image,
  });

  return org;
};

exports.updateOrgDomainService = async (orgId, domain) => {
  const org = await Organization.findByPk(orgId);
  if (!org) throw new Error("Organization not found");

  org.domain = domain;
  await org.save();

  return org;
};

exports.getOrgUsersService = async (orgId) => {
  const users = await User.findAll({
    where: { org_id: orgId },
    attributes: { exclude: ["password"] },
  });

  return users;
};

exports.inviteUserService = async ({ orgId, inviterId, email, role }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error("User already exists with this email");

  const inviteToken = jwt.sign(
    { email, org_id: orgId, role },
    process.env.JWT_SECRET,
    { expiresIn: "2d" }
  );

  const inviteLink = `${process.env.CLIENT_URL}/invite?token=${inviteToken}`;

  await sendMail({
    to: email,
    subject: "You're invited!",
    text: `You've been invited to join an organization. Click the link to accept the invitation: ${inviteLink}`,
  });

  return { inviteLink };
};

exports.deleteUserService = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  await user.destroy();
};

exports.changeUserRoleService = async (userId, newRole) => {
  const validRoles = ["SuperAdmin", "OrgAdmin", "ProjectManager", "Staff", "PublicVisitor"];

  if (!validRoles.includes(newRole)) {
    throw new Error("Invalid role");
  }

  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  user.role = newRole;
  await user.save();
};