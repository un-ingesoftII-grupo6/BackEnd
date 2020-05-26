'use strict';
module.exports = (sequelize,DataTypes) => {
const User = sequelize.define("User", {
    Usr_id: {
    type: DataTypes.BIGINT, 
    allowNull: false,
    autoIncrement: true,
    primaryKey:true
    },
    Usr_name: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    Usr_surname: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    Usr_email: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    Usr_username: {
        type: DataTypes.STRING(25),
        allowNull: false,
        unique: true
    },
    Usr_password: {
        type: DataTypes.STRING(60),
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true    
});
    User.associate = function(models) {
        User.hasMany(models.Wallet, { as: "possess", foreignKey: 'Usr_id' });
    };
    return User;
}