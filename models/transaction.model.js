const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Transaction extends Model { }

Transaction.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        customer_id: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        order_id: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        detail: {
            type: DataTypes.JSON,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        information: {
            type: DataTypes.STRING,
            allowNull: true
        },
        product_code: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        operator: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        admin_fee: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        is_inquiry: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        payment_id: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        is_paid: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        payment_date: {
            allowNull: true,
            type: DataTypes.DATE,
        },
    },
    {
        sequelize,
        modelName: "transaction",
        underscored: true,
        timestamps: true
    }
)

module.exports = Transaction