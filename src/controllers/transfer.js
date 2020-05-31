const helpers = require("../lib/helpers");
const uuid = require('uuid');
const models = require("../../models");
const persistence = require("../patterns/factory_persistence")

const persistenceFactory = new persistence.Factory();

const createTransfer = async (req, res) => {
    persistenceFactory.create(req, res, "transfer", "create");
}

const getAllTransfers = async (req, res) => {
    persistenceFactory.create(req, res, "transfer", "read");
}

const updateTransfer = async (req, res) => {
    persistenceFactory.create(req, res, "transfer", "update");
};

const deleteTransfer = async (req, res) => {
    persistenceFactory.create(req, res, "transfer", "delete");
};

module.exports = {
    createTransfer,
    getAllTransfers,
    updateTransfer,
    deleteTransfer
}