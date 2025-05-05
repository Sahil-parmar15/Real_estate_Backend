const { getAllOrganizationsService,
        updateCompanyStatus,
        deleteCompany,

 } = require("../services/superadmin.service");

exports.getAllOrganizations = async (req, res) => {
  try {
    const companies = await getAllOrganizationsService();
    res.status(200).json({ success: true, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCompanyStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid status provided. Status must be "approved", "rejected", or "pending".',
      });
    }

    const updatedCompany = await updateCompanyStatus(id, status);

    if (!updatedCompany) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "company status updated successfully!",
      data: updatedCompany,
    });

  } catch (error) {
    console.error("Error updating company status:", error.message);
    res.status(500).json({
      success: false,
      message: "failed to update company status",
      error: error.message,
    });
  }
};

exports.deleteCompany = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid company ID provided.",
    });
  }

  try {
    const deletedCompany = await deleteCompany(id);  

    if (!deletedCompany) {
      return res.status(404).json({
        success: false,
        message: 'Company not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Company deleted successfully!',
    });
  } catch (error) {
    console.error('Error deleting company:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete company',
      error: error.message,
    });
  }
};
