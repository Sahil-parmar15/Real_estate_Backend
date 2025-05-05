const { Organization } = require("../models/organization.model");

exports.getAllOrganizationsService = async () => {
  const companies = await Organization.findAll({
    attributes: ['id', 'name', 'domain', 'address', 'phone', 'logo', 'image', 'status'],
    order: [['createdAt', 'DESC']]
  });
  return companies;
};
