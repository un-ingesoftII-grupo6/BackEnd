'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("BANK", [{
      Bank_name: "Bancolombia",
      Bank_description: "Banco colombiano",
      Bank_is_authorized: 1,
      Bank_month_limit: 5000000.00,
      Bank_transfer_limit: 10000000.00
    },]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("BANK", null, {});
  }
};