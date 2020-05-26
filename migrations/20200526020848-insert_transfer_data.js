'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("TRANSFER", [{
      Tra_id: 1,
      Bank_name: "Bancolombia",
      Tra_name: "Envío dinero",
      Tra_description: "Envío de dinero entre dos personas normales",
      Tra_interest_rate: 2
    },{
      Tra_id: 2,
      Bank_name: "Bancolombia",
      Tra_name: "Recibir dinero",
      Tra_description: "Recibir dinero entre dos personas normales",
      Tra_interest_rate: 0
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("TRANSFER", null, {});
  }
};