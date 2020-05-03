const express = require("express");
const router = express.Router();
const controllers = require("../controllers/user");

//Creates a new user
router.post("/signup", controllers.createUser);
//Find user by username
router.get('/find/:username', controllers.getUserByUsername);

module.exports = router;