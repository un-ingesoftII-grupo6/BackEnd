'use strict';
module.exports = (sequelize, DataTypes) => {
    const Bank = sequelize.define("Bank", {
        Bank_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        Bank_name: {
            type: DataTypes.CHAR(60),
            allowNull: false,
            unique: true
        },
        Bank_description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        Bank_is_authorized: {
            type: DataTypes.TINYINT(1),
            allowNull: false
        },
        Bank_month_limit: {
            type: DataTypes.DOUBLE(20, 2),
            allowNull: false
        },
        Bank_transfer_limit: {
            type: DataTypes.DOUBLE(20, 2),
            allowNull: false,
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });
    Bank.associate = function (models) {
        Bank.hasMany(models.Transfer, { as: "is_authorized", foreignKey: "Bank_id" });
    };
    return Bank;
}