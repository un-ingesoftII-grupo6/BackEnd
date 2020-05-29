const express = require('express');
const router = express.Router();
const uuid = require('uuid');


/*router.post('/login', async (req, res) => {

    const { email, password } = req.body;
    console.log(email,'asd ', password);
    var users = await pool.query('SELECT * FROM user WHERE USR_USERNAME = ? AND USR_PASSWORD = ?',[email,password]);
    // Es necesario definir un usename en el sign up, para ponerlo en el query
    var wallets = await pool.query('SELECT * FROM wallet WHERE USR_ID = ?', [users[0].USR_ID]);
    
    if(users.length == 1) {
        let user = {
            name: users[0].USR_NAME,
            lastName: users[0].USR_SURNAME,
            id_wallet: wallets[0].WAL_ID
        }
        res.render('wallet.html', user);
    } else {
        res.send("El usuario o contraseña ingresados son incorrectos");
        res.status(400);
    }  
});*/

/*router.post('/signup', async (req, res) => {
    const {password, confirmPassword, email, confirmEmail} = req.body;
    const count = await pool.query('SELECT * FROM user;'); //Temporal, se quitará cuando ponga los autoincrementales
    const diff = await pool.query('SELECT * FROM user WHERE USR_EMAIL = ?',[email]); // por ahora valida sólo que el email sea distinto
    if(password != confirmPassword  || email != confirmEmail) {
        res.send("Las contraseñas y los emails deben ser iguales");
        res.status(400);
    } else if (diff.length != 0) {
        res.send("El correo seleccionado ya se encuentra registrado");
        res.status(400);
    } else{
        
        
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
});*/

// Export module
module.exports = router;