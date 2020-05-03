const Sequelize = require("sequelize");

module.exports = sequelize.define("Bank", {
    Bank_name: {
    type: Sequelize.CHAR(60), 
    allowNull: false,
    primaryKey:true
    },
    Bank_description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    Bank_is_authorized: {
        type: Sequelize.TINYINT(1),
        allowNull: false
    },
    Bank_month_limit: {
        type: Sequelize.DOUBLE(20,2),
        allowNull: false
    },
    Bank_transfer_limit: {
        type: Sequelize.DOUBLE(20,2),
        allowNull: false,
    }
}, {
    timestamps: false,
    freezeTableName: true    
    });