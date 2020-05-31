const helpers = require("../lib/helpers");
const uuid = require('uuid');
const models = require("../../models");
const persistence = require("../patterns/factory_persistence");
const logger = require('../logger/logger');

const persistenceFactory = new persistence.Factory();

const createUser = async (req, res) => {
  persistenceFactory.create(req, res, "user", "create");
  logger.info("user", "create");
}

const getAllUsers = async (req, res) => {
  persistenceFactory.create(req, res, "user", "read");
  logger.info("user", "read");
}

const getUserByUsername = async (req, res) => {
  persistenceFactory.create(req, res, "user-by-username", "read");
  logger.info("user-by-username", "read");
}

const updateUser = async (req, res) => {
  persistenceFactory.create(req, res, "user", "update");
  logger.info("user", "update");
};

const deleteUser = async (req, res) => {
  persistenceFactory.create(req, res, "user", "delete");
  logger.info("user", "delete");
};

const validateUser = async (req, res) => {
  persistenceFactory.create(req,res,"user-validate","read");
  logger.info("user-validate", "read");
}

module.exports = {
  createUser,
  getAllUsers,
  getUserByUsername,
  updateUser,
  deleteUser,
  validateUser
}