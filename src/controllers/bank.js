const helpers = require("../lib/helpers");
const uuid = require('uuid');
const models = require("../../models");
const persistence = require("../patterns/factory_persistence")

const persistenceFactory = new persistence.Factory();

const createBank = async (req, res) => {
    persistenceFactory.create(req, res, "bank", "create");
}

const getAllBanks = async (req, res) => {
    persistenceFactory.create(req, res, "bank", "read");
}

const updateBank = async (req, res) => {
    persistenceFactory.create(req, res, "bank", "update");
};

const deleteBank = async (req, res) => {
    persistenceFactory.create(req, res, "bank", "delete");
};

module.exports = {
    createBank,
    getAllBanks,
    updateBank,
    deleteBank
}