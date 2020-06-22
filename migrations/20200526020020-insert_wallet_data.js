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
    },{
      Wal_id: "022f8a82-5d63-408d-bbd3-9b123f86a14c", //uuid.v4(), //Wallet enterprise1
      Usr_id: null,
      Wtyp_id: 2,
      Ent_id: 1,
      Wal_balance: 100000000.00,
      Wal_state: "Active",
      Wal_movement_limit: 5000000.00,
      Wal_month_limit: 2500000.00
    },{
      Wal_id: "1a10209b-63e6-42bd-98c9-f33d28a8d318", //uuid.v4(), //Wallet enterprise2
      Usr_id: null,
      Wtyp_id: 2,
      Ent_id: 2,
      Wal_balance: 20000000.00,
      Wal_state: "Active",
      Wal_movement_limit: 8800000.00,
      Wal_month_limit: 4400000.00
    },{
      Wal_id: "12345", //uuid.v4(), //Wallet dummy
      Usr_id: 4, //Dummy User
      Wtyp_id: 1,
      Ent_id: 3, //Dummy Enterprise
      Wal_balance: 20000000.00,
      Wal_state: "Active",
      Wal_movement_limit: 8800000.00,
      Wal_month_limit: 4400000.00
    }
  ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("WALLET", null, {});
  }
};