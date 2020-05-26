'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("WALLETTYPE", [{
      Wtyp_name: "Personal",
      Wtyp_description: "This is a personal wallet",
      Wtyp_movement_limit: 4000000.00,
      Wtyp_month_limit: 2000000.00
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("WALLETTYPE", null, {});
  }
};
