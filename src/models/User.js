const Sequelize = require("sequelize");

module.exports = sequelize.define("User", {
    Usr_id: {
    type: Sequelize.BIGINT, 
    allowNull: false,
    primaryKey:true
    },
    Usr_name: {
        type: Sequelize.STRING(30),
        allowNull: false
    },
    Usr_surname: {
        type: Sequelize.STRING(30),
        allowNull: false
    },
    Usr_email: {
        type: Sequelize.STRING(40),
        allowNull: false
    },
    Usr_username: {
        type: Sequelize.STRING(25),
        allowNull: false,
        unique: true
    },
    Usr_password: {
        type: Sequelize.STRING(60),
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true    
});