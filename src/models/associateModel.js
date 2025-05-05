const { User } = require("./user.model");
const { Organization } = require("./organization.model");

const applyAssociations = () => {
  Organization.hasMany(User, {
    foreignKey: "org_id",
    as: "users",
  });

  User.belongsTo(Organization, {
    foreignKey: "org_id",
    as: "organization",
  });
};

module.exports = { applyAssociations };
