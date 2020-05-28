'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("TRANSFER", [{
      Tra_id: 1,
      Bank_name: null,
      Tra_name: "Envío dinero",
      Tra_route: "send-money",
      Tra_description: "Envío de dinero entre dos personas normales",
      Tra_interest_rate: 2
    },{
      Tra_id: 2,
      Bank_name: "Bancolombia",
      Tra_name: "Consignar a Banco",
      Tra_route: "bank-consignation",
      Tra_description: "Se hace un pago a una entidad bancaria",
      Tra_interest_rate: 0
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("TRANSFER", null, {});
  }
};