const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const helpers = require('../lib/helpers')

//Creates a new user
router.post("/signup", userController.createUser);
//validate user in db and return a access token
router.post("/login",userController.validateUser);

//////////////////////Methods below this line are validated with token////////////////////////////
router.use(helpers.beginTokenValidation);

//Finds all users in the database
router.get("/find/all", userController.getAllUsers);
//Find user by username
router.get('/find/:username', userController.getUserByUsername);
//Deletes user by username
router.delete('/delete/:username', userController.deleteUser);
//Updates the user by username
router.put("/edit/:username",userController.updateUser);

module.exports = router;