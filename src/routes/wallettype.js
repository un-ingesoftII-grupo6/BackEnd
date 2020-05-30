const express = require("express");
const router = express.Router();
const wtypController = require("../controllers/wallettype");

//Creates a new Wallet Type
router.post("/create", wtypController.createWalletType);
//Finds all Wallet Types
router.get("/find/all",wtypController.getAllWalletTypes);
//Update bank by Wtyp_id
router.put("/edit/:wtyp_id",wtypController.updateWalletType);
//Deletes user by username
router.delete('/delete/:wtyp_id', wtypController.deleteWalletTypeById);
//Update bank if wallet type is Enterprise (?)

module.exports = router;