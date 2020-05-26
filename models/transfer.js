'use strict';
module.exports = (sequelize,DataTypes) => {
const Transfer = sequelize.define("Transfer", {
    Tra_id: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
    },
    Bank_name: {
        type: DataTypes.CHAR(60),
        allowNull: true
    },
    Tra_name: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    Tra_description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    Tra_interest_rate: {
        type: DataTypes.INTEGER(2),
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true    
});
    Transfer.associate = function(models) {
        Transfer.hasMany(models.Movement, { as: "is given", foreignKey: "Tra_id" });
        Transfer.belongsTo(models.Bank, { as: "is authorized", foreignKey: "Bank_name" });
    };
    return Transfer;
}