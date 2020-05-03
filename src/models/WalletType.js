const Sequelize = require("sequelize");

module.exports = sequelize.define("WalletType", {
    Wtyp_id: {
    type: Sequelize.INTEGER, 
    allowNull: false,
    primaryKey:true
    },
    Wtyp_name: {
        type: Sequelize.STRING(30),
        allowNull: false,
    },
    Wtyp_description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    Wtyp_movement_limit: {
        type: Sequelize.DOUBLE(20,2),
        allowNull: false
    },
    Wtyp_month_limit: {
        type: Sequelize.DOUBLE(20,2),
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true    
});