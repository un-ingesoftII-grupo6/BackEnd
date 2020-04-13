const express = require('express');
const router = express.Router();
const uuid = require('uuid');

var users = [];

router.get('/', (req, res) => {
    res.render('index.html', { title : 'UN Wallet' });
});

router.get('/login', (req, res) => {
    res.render('login.html', { title : 'Log in' });
});

router.get('/signup', (req, res) => {
    res.render('signup.html', { title : 'Sign up' });
});

router.get('/wallet', (req, res) => {
    res.render('/wallet.html');
});

router.post('/login', (req, res) => {
    // Acá va la validación con la base de datos
    var flag = false;
    var user = null;

    for(var i = 0; i < users.length; i++) { //búsqueda de la existencia de un usuario (por el momento se trabaja en memoria)
        if(req.body.email == users[i].email && req.body.password == users[i].password) {
            user = users[i];
            flag = true;
            break;
        }
    }

    if(flag) {
        res.render('wallet.html', user);
    } else {
        res.send(400).send('El ususario no existe');
    }  
});

router.post('/signup', (req, res) => {
    // Acá va la validación con la base de datos 
    if(req.body.password != req.body.confirmPassword  || req.body.email != req.body.confirmEmail) {
        res.send(400).send("Las contraseñas y los emails deben ser iguales");
    } else {
        let wallet = { // Se debe agregar la wallet a la base de datos
            id_wallet : uuid.v4(),
            balance : 0.0,
            state : true
        };

        let user = { // El usuario debe ser guardado en la base de datos si todo está correcto
            name : req.body.name,
            lastName : req.body.lastName,
            email : req.body.email,
            password : req.body.password,
            wallet_user : wallet
        };

        users.push(user);
        res.render('wallet.html', user);
    }
});

// Export module
module.exports = router;