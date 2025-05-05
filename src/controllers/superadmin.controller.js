const { getAllOrganizationsService } = require("../services/superadmin.service");

exports.getAllOrganizations = async (req, res) => {
  try {
    const companies = await getAllOrganizationsService();
    res.status(200).json({ success: true, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
