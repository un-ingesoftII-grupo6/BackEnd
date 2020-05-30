const {createLogger,format,transports} = require('winston');//librería para registro de eventos
//const bunyan = require('bunyan');

module.exports = createLogger({
  format: format.combine(
    format.simple(), 
    format.timestamp(),
    format.printf(info => `[${info.timestamp}] ${info.level} ${info.message}`)
  ),
  trasnports: [
    /*new transports.File({
      maxsize: 5120000,
      maxFiles: 5,
      filename: `${__dirname}/../logs/log-api.log`
    }),*/

    new transports.Console({
      level: 'debug'
    })
  ]
});
