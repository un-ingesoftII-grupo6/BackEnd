'use strict';
module.exports = (sequelize,DataTypes) => {
const Movement = sequelize.define("Movement", {
    Tra_id: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        unique: true,
        primaryKey:true
    },
    Wal_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        unique: true,
        primaryKey:true
    },
    Mov_sender: {
        type: DataTypes.CHAR(25),
        allowNull: false
    },
    Mov_recipient: {
        type: DataTypes.CHAR(25),
        allowNull: false
    },
    Mov_total_amount: {
        type: DataTypes.DOUBLE(20,2),
        allowNull: false
    },
    Mov_date: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    Mov_time: {
        type: DataTypes.STRING(5),
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
        Movement.belongsTo(models.Wallet, { as: "modifies", foreignKey: "Wal_id" });
        Movement.belongsTo(models.Transfer, { as: "is given", foreignKey: "Tra_id" });
    };
    return Movement;
}