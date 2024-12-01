const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class PLN extends Model {
}

PLN.init({
    id: {
        allowNull: false,
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    customer_id: {
        allowNull: false,
        type: DataTypes.BIGINT
    },
    order_id: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    product_code: {
        allowNull: false,
        type: DataTypes.STRING
    },
    payment_date: {
        allowNull: true,
        type: DataTypes.DATE
    },
    operator: {
        allowNull: true,
        type: DataTypes.STRING
    },
    base_bill: {
        allowNull: true,
        type: DataTypes.BIGINT
    },
    admin_fee: {
        allowNull: true,
        type: DataTypes.BIGINT
    },
    price: {
        allowNull: true,
        type: DataTypes.BIGINT
    },
    sn: {
        allowNull: true,
        type: DataTypes.STRING
    },
    customer_name: {
        allowNull: true,
        type: DataTypes.STRING
    },
    stan_meter: {
        allowNull: true,
        type: DataTypes.STRING
    },
    periode: {
        allowNull: true,
        type: DataTypes.STRING
    },
    tarif_daya: {
        allowNull: true,
        type: DataTypes.STRING
    }
}, {
    sequelize,
    modelName: 'pln',
    underscored: true,
    timestamps: true,
})

module.exports = PLN