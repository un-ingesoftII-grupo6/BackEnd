'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("USER", {
      Usr_id: {
        type: Sequelize.BIGINT, 
        //allowNull: false,
        autoIncrement: true,
        primaryKey:true
        },
        Usr_name: {
            type: Sequelize.STRING(30),
            allowNull: false
        },
        Usr_surname: {
            type: Sequelize.STRING(30),
            allowNull: false
        },
        Usr_email: {
            type: Sequelize.STRING(40),
            allowNull: false
        },
        Usr_username: {
            type: Sequelize.STRING(25),
            allowNull: false,
            unique: true
        },
        Usr_password: {
            type: Sequelize.STRING(60),
            allowNull: false
        }
    })
},

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("USER");
  }
};
