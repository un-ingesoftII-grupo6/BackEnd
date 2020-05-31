const express = require("express");
const router = express.Router();
const enterpriseController = require("../controllers/enterprise");

//Creates a new enterprise
router.post("/create", enterpriseController.createEnterprise);
//Finds all enterprises in the database
router.get("/find/all",enterpriseController.getAllEnterprises);
//Updates an Enterprise
router.put("/edit/:ent_id", enterpriseController.updateEnterprise);
//Delete enterprise by NIT
router.delete("/delete/:ent_id", enterpriseController.deleteEnterprise);
//Managed wallets for enterprise

module.exports = router;