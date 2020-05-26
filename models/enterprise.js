'use strict';
module.exports = (sequelize,DataTypes) => {
const Enterprise = sequelize.define("Enterprise", {
    Ent_NIT: {
    type: DataTypes.CHAR(25), 
    allowNull: false,
    primaryKey:true
    },
    Ent_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    Ent_budget: {
        type: DataTypes.DOUBLE(20,2),
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
    }
}, {
    timestamps: false,
    freezeTableName: true    
});
    Enterprise.associate = function(models) {
        Enterprise.hasMany(models.Wallet, { as: "manages", foreignKey: "Ent_NIT" });
    };
    return Enterprise;
}