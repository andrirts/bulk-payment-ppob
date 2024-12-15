const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class PLNPrepaid extends Model { }

PLNPrepaid.init(
    {
        id: {
            allowNull: false,
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        customer_id: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        order_id: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        product_code: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        payment_date: {
            allowNull: true,
            type: DataTypes.DATE,
        },
        operator: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        base_bill: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        admin_fee: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        price: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        sn: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        customer_name: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        total_kwh: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        tarif_daya: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        materai: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        ppn: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        ppj: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        angsuran: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        no_stroom: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        no_meter: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        keterangan: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        is_inquiry: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        payment_id: {
            allowNull: true,
            type: DataTypes.STRING
        },
        is_paid: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: "pln_prepaid",
        underscored: true,
        timestamps: true,
    }
);

module.exports = PLNPrepaid;