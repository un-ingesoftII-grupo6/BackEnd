const express = require("express");
const router = express.Router();
const managementController = require("../controllers/management");

//Creates a new user
router.put("/wallet/edit/:wal_id", managementController.updateWallet);


module.exports = router;