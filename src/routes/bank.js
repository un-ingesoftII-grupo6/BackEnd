const express = require("express");
const router = express.Router();
const bankController = require("../controllers/bank");

//Creates a new bank
router.post("/create", bankController.createBank);
//Finds all banks
router.get("/find/all",bankController.getAllBanks);
//Updates a Bank
router.put("/edit/:bank_id", bankController.updateBank);
//Deletes user by username
router.delete('/delete/:bank_id', bankController.deleteBank);

//Update bank if wallet type is Enterprise (?)

module.exports = router;