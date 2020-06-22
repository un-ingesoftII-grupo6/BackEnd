'use strict';
const helpers = require("../src/lib/helpers");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const pass = await helpers.encryptPassword("Abcd1234");
    const pass2 = await helpers.encryptPassword("123123");
    const pass3 = await helpers.encryptPassword("enterprise1");
    return queryInterface.bulkInsert("USER", [{
      Usr_name: "Miguel",
      Usr_surname: "Peña",
      Usr_email: "miapenahu@unal.edu.co",
      Usr_username: "miapenahu",
      Usr_password: pass
    },{
      Usr_name: "Nicolás",
      Usr_surname: "Rodríguez",
      Usr_email: "nicrodriguezval@unal.edu.co",
      Usr_username: "nicrodriguezval",
      Usr_password: pass2
    },{
      Usr_name: "Miguel",
      Usr_surname: "Peña",
      Usr_email: "miapenahu@unal.edu.co",
      Usr_username: "miapenahu-enterprise1",
      Usr_password: pass3
    },{
      Usr_name: "Dummy",
      Usr_surname: "Dummy",
      Usr_email: "dummy@dummy.edu.co",
      Usr_username: "dummy-user",
      Usr_password: pass
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("USER", null, {});
  }
};