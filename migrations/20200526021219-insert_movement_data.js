'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert("MOVEMENT", [{
      Tra_id: 1,
      Wal_id_sender: "bce63b35-031b-43a3-988d-bd6600a0b5af",
      Wal_id_recipient: "58ecb6c2-c137-418b-9b2f-01425ac7b124",
      Mov_total_amount: 50000.00,
      Mov_is_successful: 0,
      Mov_timestamp: new Date()
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("MOVEMENT", null, {});
  }
};