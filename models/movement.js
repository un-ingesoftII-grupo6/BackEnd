'use strict';
module.exports = (sequelize,DataTypes) => {
const Movement = sequelize.define("Movement", {
    Mov_id: {
        type: DataTypes.BIGINT, 
        //allowNull: false,
        autoIncrement: true,
        primaryKey:true
        },
    Tra_id: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        unique: true
    },
    Wal_id_sender: {
        type: DataTypes.CHAR(36), 
        allowNull: false
    },
    Wal_id_recipient: {
        type: DataTypes.CHAR(36), 
        allowNull: false
    },
    Mov_total_amount: {
        type: DataTypes.DOUBLE(20,2),
        allowNull: false
    },
    Mov_is_successful: {
        type: DataTypes.TINYINT(1),
        allowNull: false
    },
    Mov_timestamp: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: false,
    freezeTableName: true       
});
    Movement.associate = function(models) {
        Movement.belongsTo(models.Wallet, { as: "modifies_sender", foreignKey: "Wal_id_sender" });
        Movement.belongsTo(models.Wallet, { as: "modifies_recipient", foreignKey: "Wal_id_recipient" });
        Movement.belongsTo(models.Transfer, { as: "is_given", foreignKey: "Tra_id" });
    };
    return Movement;
}