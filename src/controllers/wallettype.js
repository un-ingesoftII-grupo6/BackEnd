const helpers = require("../lib/helpers");
const uuid = require('uuid');
const models = require("../../models");
const persistence = require("../patterns/factory_persistence")

const persistenceFactory = new persistence.Factory();

const createWalletType = async (req, res) => {
    persistenceFactory.create(req, res, "wallet-type", "create");
}

const getAllWalletTypes = async (req, res) => {
    persistenceFactory.create(req, res, "wallet-type", "read");
}

const updateWalletType = async (req, res) => {
    persistenceFactory.create(req, res, "wallet-type", "update");
};


const deleteWalletTypeById = async (req, res) => {
  persistenceFactory.create(req,res,"wallet-type","delete");
};

module.exports = {
    createWalletType,
    getAllWalletTypes,
    updateWalletType,
    deleteWalletTypeById
}