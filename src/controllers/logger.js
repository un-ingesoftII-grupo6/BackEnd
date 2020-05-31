const {createLogger,format,transports} = require('winston');//librería para registro de eventos
//const bunyan = require('bunyan');

module.exports = createLogger({
  format: format.combine(
    format.simple(), 
    format.timestamp(),
    format.printf(info => `[${info.timestamp}] ${info.level} ${info.message}`),
    format.printf(debug => `[${debug.timestamp}] ${debug.level} ${debug.message}`),
    format.printf(error => `[${error.timestamp}] ${error.level} ${error.message}`)
  ),
  trasnports: [
    new transports.File({
      maxsize: 5242880, //5MB
      maxFiles: 5,
      filename: `${__dirname}/../logs/logs.log`,//'./logs/logs.log',
      handleExceptions: true,
      json: true,
      colorize: false,
      level: 'debug'
    }),
    new transports.Console({
      handleExceptions: true,
      json: false,
      colorize: true,
      level: 'info'
    }),
    new transports.Console({
      handleExceptions: true,
      json: false,
      colorize: true,
      level: 'error',
    }),
  ],
  exitOnError: false
});

