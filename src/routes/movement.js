const express = require("express");
const router = express.Router();
const movementController = require("../controllers/movement");

//Creates a new movement set for one transaction
router.post("/:transfer_type/:username_sender/:username_recipient", movementController.createMovement);
//Finds all movements for one user
router.get("/find/all/:username", movementController.getAllMovementsByUsername);
//Finds all movements, sorted by user and wallet
router.get("/find/all/", movementController.getAllMovements);
//Deletes specified movement by username and timestamp
router.delete("/delete/:username", movementController.deleteMovementbyTimestamp);
//Deletes specified movement by username and mov_id
router.delete("/delete/:username/:mov_id", movementController.deleteMovementbyMovId);

module.exports = router;