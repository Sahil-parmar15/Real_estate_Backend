const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  profile_picture: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM(
      "SuperAdmin",
      "OrgAdmin",
      "ProjectManager",
      "Staff",
      "PublicVisitor"
    ),
    allowNull: false,
    defaultValue: "PublicVisitor",
  },
  status: {
    type: DataTypes.ENUM("Active", "InActive", "Pending", "Rejected"),
    allowNull: true,
    defaultValue: "Pending",
  },
  refreshToken: {
    type: DataTypes.STRING,
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  org_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "organizations", 
      key: "id"
    },
    onDelete: "CASCADE"
  }
}, {
  timestamps: true,
  tableName: "users",
}); 

module.exports = { User }