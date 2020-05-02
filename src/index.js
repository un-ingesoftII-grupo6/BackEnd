// call dependencies
const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');

const { database } = require('./keys');

// setings 
app.set('port', process.env.PORT || 8080)
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'ejs');

//middlewares
app.use(session({
    secret: 'unwalletappmysqlnodesession', //Esta clave es cualquiera
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database) //Guarda sesión en MySQL
}));

// view petitions
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//DB Connection
require("./database/connection");
require("./bootstrap")();

// routes
app.use(require('./routes/'));
app.use('/index', require('./routes/index'));

//Routes Handler
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

// static files
app.use(express.static(path.join(__dirname, 'public')));

// listening the server 
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});

module.exports = app;