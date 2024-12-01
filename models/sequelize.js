const sequelize = require("../config/database");
const PLN = require("./pln.model");

const syncModels = async () => {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    await PLN.sync({ alter: true });

    console.log("Models created/updated successfully.");

}

module.exports = {
    syncModels
};