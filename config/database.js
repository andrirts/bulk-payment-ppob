const { Sequelize } = require('sequelize');
const { DB_CONFIG } = require('./constants');

const sequelize = new Sequelize({
    dialect: 'postgres',
    logging: false,
    host: DB_CONFIG.host,
    port: DB_CONFIG.port,
    username: DB_CONFIG.username,
    password: DB_CONFIG.password,
    database: DB_CONFIG.database,
})

module.exports = sequelize