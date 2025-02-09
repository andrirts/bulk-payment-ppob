const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class User extends Model { }

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pin: {
            type: DataTypes.STRING,
            allowNull: false
        },
        partner_id: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: "user",
        underscored: true,
        timestamps: true
    })

module.exports = User;