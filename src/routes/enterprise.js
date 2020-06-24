const express = require("express");
const router = express.Router();
const enterpriseController = require("../controllers/enterprise");
const helpers = require('../lib/helpers')

//Creates a new enterprise
router.post("/create", enterpriseController.createEnterprise);
//Validate user in db and return access token
router.post('/login', enterpriseController.validateEnterprise);

//////////////////////Methods below this line are validated with token////////////////////////////
router.use(helpers.beginTokenValidation);

//Finds all enterprises in the database
router.get("/find/all",enterpriseController.getAllEnterprises);
//Find enterprise by username
router.get('/find/:username', enterpriseController.getEnterpriseByUsername);
//Find users managed by an Enterprise
router.get('/find/managed/:username', enterpriseController.getUsersByEnterprise);
//Updates an Enterprise
router.put("/edit/:username", enterpriseController.updateEnterprise);
//Delete enterprise by NIT
router.delete("/delete/:ent_id", enterpriseController.deleteEnterprise);
//Managed wallets for enterprise

module.exports = router;