// call dependencies
const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('./controllers/logger');
const sequelizeConnection = require('./database/connection');
const user = require('./controllers/user');

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

app.route('/').get((req,res)=>{
    const foundUser = user.validateUser(req.query);
    logger.info('Validación Usuario');
    res.send('Perfil de usuario',{ foundUser });
    //res.send("User found", { foundUser });
});
/*
app.get('/',(req, res) => {
    logger.info("lo del get");
    const foundUser = user.validateUser(req,res);
    res.send("User found", { foundUser });
});
*/
/*
app.get("/", (req, res) => {
    logger.info("/ query", { query: req.query });
  
    logger.info("Finding user", { q: req.query.q });
    //const foundUser = User.findUser(req.query.q);
    const foundUser = User.validateUser(req.query.q);
    logger.info("User found", { foundUser });
  
    const msg = {
      username: foundUser && foundUser.username,
      foundUser: !!foundUser
    };
    logger.info("/ response", msg);
    res.json(msg);
  });
*/


// listening the server 
app.listen(app.get('port'), () => {
    logger.info('Server on port:'+ app.get('port'))
});

//DB Connection
//require("./database/connection");
sequelizeConnection.authenticate().then(() => {
    logger.info('Connection has been established successfully!');
  }).catch((err) => {
    logger.info('Can\'t establish database connection:\n' + err);
  });

//Routes Instanciation
app.use(require('./routes/index1'));
app.use('/index',require('./routes/index1'));
const userRoutes = require("./routes/user");
const managementRoutes = require("./routes/management");

//Routes Handler
app.use("/user",userRoutes);
app.use("/management",managementRoutes);

//middlewares

var whitelist = ['http://localhost:8000']

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