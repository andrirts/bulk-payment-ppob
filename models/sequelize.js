const sequelize = require("../config/database");
const Transaction = require("./transaction.model");
const User = require("./user.model");

const syncModels = async () => {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");

  await Transaction.sync({ alter: true });
  await User.sync({ alter: true });
  console.log("Models created/updated successfully.");
};

module.exports = {
  syncModels,
};
