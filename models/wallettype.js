'use strict';
module.exports = (sequelize,DataTypes) => {
const WalletType = sequelize.define("WalletType", {
    Wtyp_id: {
    type: DataTypes.INTEGER, 
    autoIncrement: true,
    primaryKey:true
    },
    Wtyp_name: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    Wtyp_description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    Wtyp_movement_limit: {
        type: DataTypes.DOUBLE(20,2),
        allowNull: false
    },
    Wtyp_month_limit: {
        type: DataTypes.DOUBLE(20,2),
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true    
});
    WalletType.associate = function(models) {
        WalletType.hasMany(models.Wallet, { as: "give roles", foreignKey: "Wtyp_id" });
    };
    return WalletType;
}