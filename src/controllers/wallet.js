const helpers = require("../lib/helpers");
const uuid = require('uuid');
const models = require("../../models");
const persistence = require("../patterns/factory_persistence")

const persistenceFactory = new persistence.Factory();

const createWallet = async (req, res) => {
    persistenceFactory.create(req, res, "wallet", "create");
}

const getAllWallets = async (req, res) => {
    persistenceFactory.create(req, res, "wallet", "read");
}

const getAllWalletsByUsername = async (req, res) => {
    persistenceFactory.create(req, res, "wallet-by-username", "read");
}

const updateWallet = async (req, res) => {
    persistenceFactory.create(req, res, "wallet", "update");
};

const updateWalletState = async (req, res) => {
    persistenceFactory.create(req, res, "wallet-state", "update");
};


const deleteWallet = async (req, res) => {
    persistenceFactory.create(req, res, "wallet", "delete");
}

module.exports = {
    createWallet,
    getAllWallets,
    updateWallet,
    updateWalletState,
    getAllWalletsByUsername,
    deleteWallet
}