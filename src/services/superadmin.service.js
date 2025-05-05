const { Organization } = require("../models/organization.model");

exports.getAllOrganizationsService = async () => {
  const companies = await Organization.findAll({
    attributes: ['id', 'name', 'domain', 'address', 'phone', 'logo', 'image', 'status'],
    order: [['createdAt', 'DESC']]
  });
  return companies;
};

exports.updateCompanyStatus = async (id, status) => {
  const company = await Organization.findByPk(id);

  if(!company) {
      return null;
  }

  company.status = status;
  await company.save();

  return company;
}

exports.deleteCompany = async (id) => {
  const company = await Organization.findByPk(id);

  if(!company){
      return null;
  }

  await company.destroy();
  return company;
}
