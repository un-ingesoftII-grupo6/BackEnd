const helpers = require("../lib/helpers");
const uuid = require('uuid');
const models = require("../../models");
const persistence = require("../patterns/factory_persistence")

const persistenceFactory = new persistence.Factory();

const createEnterprise = async (req, res) => {
    persistenceFactory.create(req, res, "enterprise", "create");
}

const validateEnterprise = async (req, res) => {
    persistenceFactory.create(req,res,"enterprise-validate","read");
}

const getEnterpriseByUsername = async (req, res) => {
    persistenceFactory.create(req,res,"enterprise-by-username","read");
}

const getAllEnterprises = async (req, res) => {
    persistenceFactory.create(req, res, "enterprise", "read");
}

const getUsersByEnterprise = async (req, res) => {
    persistenceFactory.create(req,res,"managed-users","read");
}

const updateEnterprise = async (req, res) => {
    persistenceFactory.create(req, res, "enterprise", "update");
};

const deleteEnterprise = async (req, res) => {
    persistenceFactory.create(req, res, "enterprise", "delete");
};

module.exports = {
    createEnterprise,
    validateEnterprise,
    getEnterpriseByUsername,
    getUsersByEnterprise,
    getAllEnterprises,
    updateEnterprise,
    deleteEnterprise
}