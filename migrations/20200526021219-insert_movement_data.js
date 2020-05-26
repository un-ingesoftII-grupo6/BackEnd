'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert("MOVEMENT", [{
      Tra_id: 1,
      Wal_id: "bce63b35-031b-43a3-988d-bd6600a0b5af",
      Mov_sender: 1,
      Mov_recipient: 2,
      Mov_total_amount: 50000.00,
      Mov_date: "2002-04-27",
      Mov_time: "20:00",
      Mov_is_successful: 0,
      Mov_timestamp: new Date()
    },{
      Tra_id: 2,
      Wal_id: "58ecb6c2-c137-418b-9b2f-01425ac7b124",
      Mov_sender: 1,
      Mov_recipient: 2,
      Mov_total_amount: 50000.00,
      Mov_date: "2002-04-27",
      Mov_time: "20:00",
      Mov_is_successful: 0,
      Mov_timestamp: new Date()
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("MOVEMENT", null, {});
  }
};