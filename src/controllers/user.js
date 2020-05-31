const helpers = require("../lib/helpers");
const uuid = require('uuid');
const models = require("../../models");
const persistence = require("../patterns/factory_persistence")

const persistenceFactory = new persistence.Factory();

const createUser = async (req, res) => {
  persistenceFactory.create(req, res, "user", "create");
}

const getAllUsers = async (req, res) => {
  persistenceFactory.create(req, res, "user", "read");
}

const getUserByUsername = async (req, res) => {
  persistenceFactory.create(req, res, "user-by-username", "read");
}

const updateUser = async (req, res) => {
  persistenceFactory.create(req, res, "user", "update");
};

const deleteUser = async (req, res) => {
  persistenceFactory.create(req, res, "user", "delete");
};

const validateUser = async (req, res) => {
persistenceFactory.create(req,res,"user-validate","read");
}

module.exports = {
  createUser,
  getAllUsers,
  getUserByUsername,
  updateUser,
  deleteUser,
  validateUser
}