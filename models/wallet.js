'use strict';
module.exports = (sequelize,DataTypes) => {
const Wallet = sequelize.define("Wallet", {
    Wal_id: {
    type: DataTypes.CHAR(36), //Con 32 daba problemas para guardar en la DB
    allowNull: false,
    primaryKey:true
    },
    Usr_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    Wtyp_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Ent_id: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    Wal_balance: {
        type: DataTypes.DOUBLE(20,2),
        allowNull: false
    },
    Wal_state: {
        type: DataTypes.STRING(10),
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true    
});
    Wallet.associate = function(models) {
        Wallet.belongsTo(models.User, { as: "possess", foreignKey: "Usr_id" });
        Wallet.belongsTo(models.WalletType, { as: "give_roles", foreignKey: "Wtyp_id" });
        Wallet.belongsTo(models.Enterprise, { as: "manages", foreignKey: "Ent_id" });
        Wallet.hasMany(models.Movement, { as: "modifies_sender", foreignKey: "Wal_id_sender" });
        Wallet.hasMany(models.Movement, { as: "modifies_recipient", foreignKey: "Wal_id_recipient" });
        //Temporary: Its necesary to create migrations that do this on database level
    };
    return Wallet;
}