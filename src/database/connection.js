const Sequelize = require("sequelize");
const logger = require('../logger/logger');

const sequelize = new Sequelize("db_unwallet",'root','root', {
     host: '127.0.0.1', 
     dialect: "mysql",
    });

sequelize.authenticate().then(() => {
    logger.info('Connection has been established successfully!');
}).catch((err) => {
    logger.critical('Can\'t establish database connection: ' + err);
});

module.exports = sequelize;
global.sequelize = sequelize;