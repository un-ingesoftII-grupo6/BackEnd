const express = require("express");
const router = express.Router();
const transferController = require("../controllers/transfer");

//Creates a new transfer
router.post("/create", transferController.createTransfer);
//Finds all transfers
router.get("/find/all", transferController.getAllTransfers);
//Updates a Bank
router.put("/edit/:tra_id", transferController.updateTransfer);
//Deletes transfer by tra_id
router.delete('/delete/:tra_id', transferController.deleteTransfer);

module.exports = router;