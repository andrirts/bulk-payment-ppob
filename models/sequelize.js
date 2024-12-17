const sequelize = require("../config/database");
const PLNPrepaid = require("./pln-prepaid.model");
const PLNPasca = require("./pln-pasca.model");

const syncModels = async () => {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");

  await PLNPasca.sync({ alter: true });
  await PLNPrepaid.sync({ alter: true });

  console.log("Models created/updated successfully.");
};

module.exports = {
  syncModels,
};
