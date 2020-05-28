const express = require("express");
const router = express.Router();
const walletController = require("../controllers/wallet");

//Creates a new wallet by username
router.post("/create/:username", walletController.createWallet);
//Finds all wallet for one user
router.get("/find/all", walletController.getAllWallets);
//Finds all wallet for one user
router.get("/find/all/:username", walletController.getAllWalletsByUsername);
//Deletes specified wallet by username and wal_id
router.delete("/delete/:username/:wal_id", walletController.deleteWallet);
//Creates a new user
router.put("/edit/:username/:wal_id", walletController.updateWalletState);
module.exports = router;