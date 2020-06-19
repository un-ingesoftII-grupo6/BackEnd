'use strict';
module.exports = (sequelize, DataTypes) => {
    const Enterprise = sequelize.define("Enterprise", {
        Ent_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        Ent_NIT: {
            type: DataTypes.CHAR(25),
            allowNull: false,
            unique: true
        },
        Ent_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        Ent_description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        Ent_budget: {
            type: DataTypes.DOUBLE(20, 2),
            allowNull: false
        },
        Ent_username: {
            type: DataTypes.STRING(25),
            allowNull: false,
            unique: true
        },
        Ent_password: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        Ent_movement_limit: {
            type: DataTypes.DOUBLE(20, 2),
            allowNull: false
        },
        Ent_month_limit: {
            type: DataTypes.DOUBLE(20, 2),
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });
    Enterprise.associate = function (models) {
        Enterprise.hasMany(models.Wallet, { as: "manages", foreignKey: "Ent_id" });
    };
    return Enterprise;
}