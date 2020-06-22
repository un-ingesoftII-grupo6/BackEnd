'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("TRANSFER", [{
      Tra_id: 1,
      Bank_id: null,
      Tra_name: "Envío dinero",
      Tra_route: "send-money",
      Tra_description: "Envío de dinero entre dos personas normales",
      Tra_interest_rate: 2
    },{
      Tra_id: 2,
      Bank_id: 1,
      Tra_name: "Consignar a Bancolombia",
      Tra_route: "bancolombia-consignation",
      Tra_description: "Se hace un pago a la entidad bancaria Bancolombia",
      Tra_interest_rate: 0
    },{
      Tra_id: 3,
      Bank_id: 2,
      Tra_name: "Consignar a dummy",
      Tra_route: "dummy",
      Tra_description: "Se hace un dummy a la entidad bancaria Bancolombia",
      Tra_interest_rate: 0
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("TRANSFER", null, {});
  }
};