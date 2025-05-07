const { getOrgProfileService,
        updateOrgProfileService,
        updateOrgDomainService,
        getOrgUsersService,
        inviteUserService,
        changeUserRoleService,
 } = require('../services/organization.service');

  exports.getOrgProfile = async (req, res) => {
    try {
      const orgId = req.user.org_id;
      
      if (!orgId) throw new Error("Invalid organization");
  
      const org = await getOrgProfileService(orgId);
      res.status(200).json({ success: true, data: org });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  exports.updateOrgProfile = async (req, res) => {
    try {
      const orgId = req.user.org_id;
      const updatedData = req.body;
      const files = req.files;
  
      const updatedOrg = await updateOrgProfileService(orgId, updatedData, files);
  
      res.status(200).json({
        success: true, 
        message: "Organization profile updated", 
        data: updatedOrg });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  exports.updateOrgDomainController = async (req, res) => {
    try {
      const orgId = req.user.org_id;
      const { domain } = req.body;
  
      if (!domain) {
        return res.status(400).json({ success: false, message: "Domain is required" });
      }
  
      const updatedOrg = await updateOrgDomainService(orgId, domain);
  
      res.status(200).json({
        success: true,
        message: "Organization domain updated successfully",
        data: updatedOrg,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  exports.getOrgUsersController = async (req, res) => {
    try {
      const orgId = req.user.org_id;
  
      const users = await getOrgUsersService(orgId);
  
      res.status(200).json({
        success: true,
        message: "Organization users fetched successfully",
        data: users,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };  

  exports.inviteUserController = async (req, res) => {
    try {
      const orgId = req.user.org_id;
      const inviterId = req.user.id;
      const { email, role } = req.body;
  
      const result = await inviteUserService({ orgId, inviterId, email, role });
  
      res.status(200).json({
        success: true,
        message: "User invitation sent",
        data: result,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  exports.deleteUser = async (req, res) => {
    try {
      const userId = req.params.id;
  
      await deleteUserService(userId);
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  exports.changeUserRole = async (req, res) => {
    try {
      const userId = req.params.id;
      const { role } = req.body;
  
      if (!role) {
        return res.status(400).json({ success: false, message: "Role is required" });
      }
  
      await changeUserRoleService(userId, role);
  
      res.status(200).json({
        success: true,
        message: "User role updated successfully",
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

