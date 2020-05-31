const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const logger = require('../logger/logger');

//Creates a new user
router.post("/signup", userController.createUser);
//Finds all users in the database
router.get("/find/all",userController.getAllUsers);
//Find user by username
router.get('/find/:username', userController.getUserByUsername);
//Deletes user by username
router.delete('/delete/:username', userController.deleteUser);
//Updates the user by username
router.put("/edit/:username",userController.updateUser);
//Validate user in db
router.post('/login', userController.validateUser);

module.exports = router;