'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("MOVEMENT", {
      Mov_id: {
        type: Sequelize.BIGINT,
        //allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      Tra_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Wal_id_sender: {
        type: Sequelize.CHAR(36),
        allowNull: false
      },
      Wal_id_recipient: {
        type: Sequelize.CHAR(36),
        allowNull: false
      },
      Mov_total_amount: {
        type: Sequelize.DOUBLE(20, 2),
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
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("MOVEMENT");
  }
};
