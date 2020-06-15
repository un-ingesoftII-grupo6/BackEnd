const winston = require('winston');//library for event logs
const {format} = require('winston');//format to print the event log

const myCustomLevels = {
  levels: {
    critical: 0,
    error: 1,
    warning: 2,
    info: 3,
    debug: 4,
    trace: 5
  }
}

var precision_level = "debug"; //Controls the level of detail of the logs

var today = new Date();

module.exports = winston.createLogger({
    levels: myCustomLevels.levels,
    format: winston.format.combine(
        format.simple(), 
        format.timestamp({
          format: 'YYYY-MM-DDTHH:mm:ss'
        }),
        format.printf(info => `[${info.timestamp}-05:00] ${info.level.toUpperCase()}: ${info.message}`),
    ),
    transports: [
        new winston.transports.File({
          level: precision_level,
          maxsize: 1000000, //~1MB
          maxFiles: 5, 
          filename: 'logs/'+today.getFullYear()+today.getMonth()+today.getDate()+'-log.log'//Daily rotation of log files
        }),
        new winston.transports.Console({
          level: precision_level,
        }),
      ]

});
