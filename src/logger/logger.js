const winston = require('winston');//library for event logs
const {format} = require('winston');//format to print the event log

module.exports = winston.createLogger({
    format: winston.format.combine(
        format.simple(), 
        format.timestamp({
          format: 'YYYY-MM-DDTHH:mm:ss'
        }),
        format.printf(info => `[${info.timestamp}-05:00] ${info.level} ${info.message}`),
    ),
    transports: [
        new winston.transports.File({
          level: 'debug',
          maxsize: 5000000, //5MB
          maxFiles: 5, 
          filename: 'logs.log', //file event logs
        }),
        new winston.transports.Console({
          level: 'info'
        }),
      ]

});
