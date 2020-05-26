'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("WALLETTYPE", {
      Wtyp_id: {
        type: Sequelize.INTEGER, 
        autoIncrement: true,
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
    })
},

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("WALLETTYPE");
  }
};
