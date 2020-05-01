const Sequelize = require("sequelize");

module.exports = sequelize.define("Movement", {
    Tra_id: {
        type: Sequelize.INTEGER, 
        allowNull: false,
        unique: true,
        primaryKey:true
    },
    Wal_id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        unique: true,
        primaryKey:true
    },
    Mov_sender: {
        type: Sequelize.CHAR(25),
        allowNull: false
    },
    Mov_recipient: {
        type: Sequelize.CHAR(25),
        allowNull: false
    },
    Mov_total_amount: {
        type: Sequelize.DOUBLE(20,2),
        allowNull: false
    },
    Mov_date: {
        type: Sequelize.STRING(10),
        allowNull: false
    },
    Mov_time: {
        type: Sequelize.STRING(5),
        allowNull: false
    },
    Mov_is_successful: {
        type: Sequelize.TINYINT(1),
        allowNull: false
    },
    Mov_timestamp: {
        type: Sequelize.DATE,
        allowNull: true
    }
}, {
    timestamps: false,
    freezeTableName: true    
    });