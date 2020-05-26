// call dependencies
const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors')

// Settings 
app.set('port', process.env.PORT || 8000)
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'ejs');

// view petitions
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false})); //Just url encoded data
app.use(bodyParser.json());
app.use(cors());

// listening the server 
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});

//DB Connection
require("./database/connection");

//Routes Instanciation
app.use(require('./routes/'));
app.use('/index',require('./routes/index'));
const userRoutes = require("./routes/user");
const managementRoutes = require("./routes/management");

//Routes Handler
app.use("/user",userRoutes);
app.use("/management",managementRoutes);

//middlewares

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

/*
//CORS configuration
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin","*");
    //res.header("Access-Control-Allow-Origin","http://this-is-example.com"); //For an specific address
    res.header("Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method === 'OPTIONS'){
        res.header("Access-Control-Allow-Methods","PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});*/

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