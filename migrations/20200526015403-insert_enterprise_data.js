'use strict';
const helpers = require("../src/lib/helpers");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const pass = await helpers.encryptPassword("empresa1");
    return queryInterface.bulkInsert("ENTERPRISE", [{
      Ent_NIT: "enterprise-1",
      Ent_name: "Empresa 1",
      Ent_description: "La empresa familiar por excelencia",
      Ent_budget: 100000000.00,
      Ent_username: "enterprise1",
      Ent_password: pass
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("ENTERPRISE", null, {});
  }
};