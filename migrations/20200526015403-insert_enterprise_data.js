'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("ENTERPRISE", [{
      Ent_NIT: "enterprise-1",
      Ent_name: "Empresa 1",
      Ent_budget: 100000000.00,
      Ent_username: "enterprise1",
      Ent_password: "enterprise1"
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("ENTERPRISE", null, {});
  }
};