const helpers = require("../lib/helpers");
const uuid = require('uuid');
const models = require("../../models");
const persistence = require("../patterns/factory_persistence")

const persistenceFactory = new persistence.Factory();

const createEnterprise = async (req, res) => {
    persistenceFactory.create(req, res, "enterprise", "create");
}

const getAllEnterprises = async (req, res) => {
    persistenceFactory.create(req, res, "enterprise", "read");
}

const updateEnterprise = async (req, res) => {
    persistenceFactory.create(req, res, "enterprise", "update");
};

const deleteEnterprise = async (req, res) => {
    persistenceFactory.create(req, res, "enterprise", "delete");
};

module.exports = {
    createEnterprise,
    getAllEnterprises,
    updateEnterprise,
    deleteEnterprise
}