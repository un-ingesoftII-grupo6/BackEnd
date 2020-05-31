const Sequelize = require("sequelize");
const logger = require('../logger/logger');

const sequelize = new Sequelize("db_unwallet",'root','MIbase', {
     host: '127.0.0.1', 
     dialect: "mysql"
    });

sequelize.authenticate().then(() => {
    logger.info('Connection has been established successfully!');
}).catch((err) => {
    logger.error('Can\'t establish database connection:\n' + err);
});

module.exports = sequelize;
global.sequelize = sequelize;