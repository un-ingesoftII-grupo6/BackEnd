'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("WALLET", {
      Wal_id: {
        type: Sequelize.CHAR(36), //Con 32 daba problemas para guardar en la DB
        allowNull: false,
        primaryKey: true
      },
      Usr_id: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      Wtyp_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Ent_NIT: {
        type: Sequelize.CHAR(25),
        allowNull: true
      },
      Wal_balance: {
        type: Sequelize.DOUBLE(20, 2),
        allowNull: false
      },
      Wal_state: {
        type: Sequelize.STRING(10),
        allowNull: false
      }
    })
},

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("WALLET");
  }
};
