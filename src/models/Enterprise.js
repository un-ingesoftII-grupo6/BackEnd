const Sequelize = require("sequelize");

module.exports = sequelize.define("Enterprise", {
    Ent_NIT: {
    type: Sequelize.CHAR(25), 
    allowNull: false,
    primaryKey:true
    },
    Ent_name: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    Ent_budget: {
        type: Sequelize.DOUBLE(20,2),
        allowNull: false
    },
    Ent_username: {
        type: Sequelize.STRING(25),
        allowNull: false,
        unique: true
    },
    Ent_password: {
        type: Sequelize.STRING(60),
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true    
    });