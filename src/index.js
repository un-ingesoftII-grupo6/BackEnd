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
//app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'ejs');

var fs = require('fs');
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// view petitions
//app.use(morgan('dev'));
app.use(morgan('combined', { stream: accessLogStream }));
app.use(bodyParser.urlencoded({extended: false})); //Just url encoded data
app.use(bodyParser.json());
app.use(cors());

// setup the logger
app.get('/user', function (req, res) {
  res.send('hello, User!')
  logger.info("hello, User!")
});

// listening the server 
app.listen(app.get('port'), () => {
    //console.log('Server on port', app.get('port'));
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
app.use("/user",userRoutes);
app.use("/wallet",walletRoutes);
app.use("/movement",movementRoutes);
app.use("/bank",bankRoutes);
app.use("/transfer",transferRoutes);
app.use("/enterprise",enterpriseRoutes);
app.use("/wallet-type",wtypRoutes);

//CORS configuration

var whitelist = ['http://localhost:8080']

var corsOptions = {
    origin: function (origin, callback) {
        if(whitelist.indexOf(origin) !==1) {
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

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;