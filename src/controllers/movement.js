const helpers = require("../lib/helpers");
const uuid = require('uuid');
const models = require("../../models");
const persistence = require("../patterns/factory_persistence")

const persistenceFactory = new persistence.Factory();

const createMovement = async (req, res) => {
    persistenceFactory.create(req, res, "movement", "create");
}

const getAllMovements = async (req, res) => {
    persistenceFactory.create(req, res, "movement", "read");
}

const getAllMovementsByUsername = async (req, res) => {
    persistenceFactory.create(req, res, "movement-by-username", "read")
}

const deleteMovementbyMovId = async (req, res) => {
    persistenceFactory.create(req, res, "movement", "delete");
}

const deleteMovementbyTimestamp = async (req, res) => {
    persistenceFactory.create(req, res, "movement-by-timestamp","delete");
}

module.exports = {
    createMovement,
    getAllMovementsByUsername,
    getAllMovements,
    deleteMovementbyTimestamp,
    deleteMovementbyMovId
}