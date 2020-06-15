// call dependencies
const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors')
const logger = require('./logger/logger');
var winstonStream = require("winston-stream");
var loggerStream = winstonStream(logger, "debug");

// Settings 
app.set('port', process.env.PORT || 8000)
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'ejs');

//Customized morgan format for logger Stream
morgan.format('myformat', ' :method :url STATUS::status REMOTE_ADDR::remote-addr REMOTE_USER::remote-user USER-AGENT::user-agent');

app.use(morgan('myformat', { stream: loggerStream}));
app.use(morgan('dev')); // console petitions
app.use(bodyParser.urlencoded({ extended: false })); //Just url encoded data
app.use(bodyParser.json());

//CORS configuration

var corsOptions = {
    origin: ['http://localhost:8080','http://localhost:8081'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

app.use(cors(corsOptions));

// listening the server 
app.listen(app.get('port'), () => {
    logger.info('Server on port ' + app.get('port'));
});

//DB Connection
require("./database/connection");

//Routes Instanciation
const userRoutes = require("./routes/user");
const walletRoutes = require("./routes/wallet");
const movementRoutes = require("./routes/movement");
const bankRoutes = require("./routes/bank");
const transferRoutes = require("./routes/transfer");
const enterpriseRoutes = require("./routes/enterprise");
const wtypRoutes = require("./routes/wallettype");

//Routes Handler
app.use("/user", userRoutes);
app.use("/wallet", walletRoutes);
app.use("/movement", movementRoutes);
app.use("/bank", bankRoutes);
app.use("/transfer", transferRoutes);
app.use("/enterprise", enterpriseRoutes);
app.use("/wallet-type", wtypRoutes);

//Unknown Routes Handler

app.use((req, res, next) => { //In case of a unknown route
    logger.info("Resource not found :(");
    const error = new Error("Resource not found :(");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;