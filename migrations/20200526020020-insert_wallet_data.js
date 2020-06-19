'use strict';
//const uuid = require('uuid');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("WALLET", [{
      Wal_id: "bce63b35-031b-43a3-988d-bd6600a0b5af", //uuid.v4(), 
      Usr_id: 1,
      Wtyp_id: 1,
      Ent_id: null,
      Wal_balance: 500000.00,
      Wal_state: "Active",
      Wal_movement_limit: 4000000.00,
      Wal_month_limit: 2000000.00
    }, {
      Wal_id: "58ecb6c2-c137-418b-9b2f-01425ac7b124", //uuid.v4(), 
      Usr_id: 2,
      Wtyp_id: 1,
      Ent_id: null,
      Wal_balance: 500000.00,
      Wal_state: "Active",
      Wal_movement_limit: 4000000.00,
      Wal_month_limit: 2000000.00
    },{
      Wal_id: "48502bcf-87bb-4f88-a7f7-4a5978debb22", //uuid.v4(), 
      Usr_id: 3,
      Wtyp_id: 3,
      Ent_id: 1,
      Wal_balance: 0.00,
      Wal_state: "Active",
      Wal_movement_limit: 4000000.00,
      Wal_month_limit: 2000000.00
    }
  ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("WALLET", null, {});
  }
};