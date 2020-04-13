// call dependencies
const express = require('express');
const app = express();
const path = require('path');

// setings 
app.set('port', 8080)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middlewares 

// routes
app.use(require('./routes/index'));
// static files

// listening the server 
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});