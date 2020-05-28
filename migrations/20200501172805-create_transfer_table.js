'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("TRANSFER", {
      Tra_id: {
        type: Sequelize.INTEGER, 
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
        },
        Bank_name: {
            type: Sequelize.CHAR(60),
            allowNull: true
        },
        Tra_name: {
            type: Sequelize.STRING(30),
            allowNull: false
        },
        Tra_route: {
          type: Sequelize.STRING(30),
          allowNull: false,
          unique: true
        },
        Tra_description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        Tra_interest_rate: {
            type: Sequelize.INTEGER(2),
            allowNull: false
        }
    })
},

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("TRANSFER");
  }
};
