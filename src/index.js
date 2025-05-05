require("dotenv").config();
const app = require("./app");
const sequelize = require('./config/db');

require('./models/user.model');
require('./models/organization.model');
const { applyAssociations } = require("./models/associateModel");

applyAssociations();

sequelize.sync({ force: false })
  .then(() => console.log("Database & Table Created"))
  .catch(err => console.error("DB Sync Error:", err));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
