// call dependencies
const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors')
const logger = require('./logger/logger');

// Settings 
app.set('port', process.env.PORT || 8000)
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'ejs');

//write file stream
var fs = require('fs');
var accessLogStream = fs.createWriteStream(path.join("./", 'logs.log'), { flags: 'a' });

// view petitions
const moment = require('moment-timezone');
moment().tz("America/Bogota").format();

morgan.token('date', (req, res, tz) => {
    return moment().tz(tz).format();
})

morgan.format('myformat', '[:date[America/Bogota]] ":method :url HTTP/:http-version" :status :res[content-length] ":user-agent"');

app.use(morgan('myformat', { stream: accessLogStream }));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false })); //Just url encoded data
app.use(bodyParser.json());
app.use(cors());

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

//CORS configuration

var whitelist = ['http://localhost:8080']

var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== 1) {
            callback(null, true);
        } else {
            callback(new Error('not allowed by CORS'));
        }
    }
}

//Unknown Routes Handler

app.use((req, res, next) => { //In case of a unknown route
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