const express = require('express');
const router = express.Router();
const uuid = require('uuid');

const pool = require('../database');

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
        res.send(400).send('El usuario no existe');
    }  
});

router.post('/signup', async (req, res) => {
    // Acá va la validación con la base de datos 
    if(req.body.password != req.body.confirmPassword  || req.body.email != req.body.confirmEmail) {
        res.send(400).send("Las contraseñas y los emails deben ser iguales");
    } else {

        const count = await pool.query('SELECT * FROM user;'); //Temporal, se quitará cuando ponga los autoincrementales
        
        let newUser = {
            USR_ID: count.length + 1,
            USR_NAME: req.body.name,
            USR_SURNAME: req.body.lastName,
            USR_EMAIL: req.body.email,
            USR_USERNAME: req.body.email,
            USR_PASSWORD: req.body.password
        };

        console.log(newUser.USR_ID);            

        await pool.query('INSERT INTO user set ?', [newUser]);
        
        let newWallet = { 
            WAL_ID : uuid.v4(),
            USR_ID : newUser.USR_ID,
            WTYP_ID : 1, //Por ahora 1 representa una wallet personal 
            WAL_BALANCE : 0.0,
            WAL_STATE : "Active"
        };

        await pool.query('INSERT INTO wallet set ?', [newWallet]);

        let data = {
            name: newUser.USR_NAME,
            lastName: newUser.USR_SURNAME,
            id_wallet: newWallet.WAL_ID
        }
        res.render('wallet.html', data);
    }
});

// Export module
module.exports = router;