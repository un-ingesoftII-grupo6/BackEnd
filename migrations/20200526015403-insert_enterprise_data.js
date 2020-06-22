'use strict';
const helpers = require("../src/lib/helpers");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const pass = await helpers.encryptPassword("empresa1");
    const pass2 = await helpers.encryptPassword("empresa2");
    return queryInterface.bulkInsert("ENTERPRISE", [{
      Ent_NIT: "enterprise-1",
      Ent_name: "Empresa 1",
      Ent_description: "La empresa familiar por excelencia",
      Ent_budget: 100000000.00,
      Ent_username: "enterprise1",
      Ent_password: pass,
      Ent_movement_limit: 5000000.00,
      Ent_month_limit: 2500000.00
    },{
      Ent_NIT: "enterprise-2",
      Ent_name: "Empresa 2",
      Ent_description: "Nacida para segundear",
      Ent_budget: 20000000.00,
      Ent_username: "enterprise2",
      Ent_password: pass2,
      Ent_movement_limit: 8800000.00,
      Ent_month_limit: 4400000.00
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("ENTERPRISE", null, {});
  }
};