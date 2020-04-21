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
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// routes
app.use(require('./routes/'));
app.use('/index',require('./routes/index'));

// static files
app.use(express.static(path.join(__dirname, 'public')));

// listening the server 
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});