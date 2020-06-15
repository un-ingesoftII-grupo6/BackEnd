const helpers = require("../lib/helpers");
const uuid = require('uuid');
const models = require("../../models");
const logger = require("../logger/logger");

const User = async (req, res) => {
    try {
        const { username } = req.params;
        const findUser = await models.User.findOne({ where: { Usr_username: username } });

        if (findUser) {
            const wallets = await models.Wallet.findAll({ where: { Usr_id: findUser.Usr_id } });

            if (wallets.length > 0) {
                helpers.loggerWarnAndResponse(400,res,"This User has associated Wallets. Please delete them first"); return res;
            }
            const deleted = await models.User.destroy({
                where: { Usr_username: username }
            });
            if (deleted) {
                logger.info("User " + username + " deleted");
                return res.status(200).send("User " + username + " deleted");
            }
        }
        helpers.loggerWarnAndResponse(404,res,"Specified User not found"); return res;
    } catch (error) {
        helpers.loggerErrorAndResponse(res,error.message); return res;
    }
}

async function Bank(req, res) {
    try {
        const { bank_id } = req.params;
        const findBank = await models.Bank.findOne({ where: { Bank_id: bank_id } });

        if (findBank) {
            const transfers = await models.Transfer.findAll({ where: { Bank_id: findBank.Bank_id } });
            if (transfers) {
                transfers.forEach(async (element) => {

                    const [updated] = await models.Transfer.update({
                        Bank_id: null
                    }, {
                        where: { Bank_id: element.Bank_id }
                    });

                    if (!updated) {
                        throw new Error("Associated Transfer not updated");
                    }
                });
            }
            const deleted = await models.Bank.destroy({
                where: { Bank_id: bank_id }
            });
            if (deleted) {
                logger.info("Bank " + findBank.Bank_name + " deleted");
                return res.status(200).send("Bank " + findBank.Bank_name + " deleted");
            }
            throw new Error("Specified Bank could not be deleted");
        }
        helpers.loggerWarnAndResponse(404,res,"Specified Bank not found"); return res;
    } catch (error) {
        helpers.loggerErrorAndResponse(res,error.message); return res;
    }
}

async function Wallet(req, res) {
    try {
        const { username, wal_id } = req.params;
        const { password } = req.body;
        const findUser = await models.User.findOne({ where: { Usr_username: username } });
        const findWallet = await models.Wallet.findOne({ where: { Wal_id: wal_id } });

        if (findUser) {
            if (findWallet) {
                const movement_sender = await models.Movement.findAll({ where: { Wal_id_sender: wal_id } });
                const movement_recipient = await models.Movement.findAll({ where: { Wal_id_recipient: wal_id } });

                if (movement_sender.length > 0 || movement_recipient.length > 0) {
                    helpers.loggerWarnAndResponse(400,res,"This Wallet has associated Movements. Please delete them first"); return res;
                }
                const val = await helpers.matchPassword(password, findUser.Usr_password);
                if (val) {
                    const deleted = await models.Wallet.destroy({
                        where: { Wal_id: wal_id }
                    });
                    if (deleted) {
                        logger.info("Wallet deleted.")
                        return res.status(200).send("Wallet deleted");
                    }
                } else {
                    helpers.loggerWarnAndResponse(401,res,'The password is incorrect. Please try again'); return res;
                }
            } else {
                helpers.loggerWarnAndResponse(404,res,'Specified wallet does not exists'); return res;
            }
        }
        helpers.loggerWarnAndResponse(404,res,'User does not exists'); return res;
    } catch (error) {
        helpers.loggerErrorAndResponse(res,error.message); return res;
    }
}

async function WalletType(req, res) {
    try {
        const { wtyp_id } = req.params;
        const findWalletType = await models.WalletType.findOne({ where: { Wtyp_id: wtyp_id } });

        if (findWalletType) {
            const wallets = await models.Wallet.findAll({ where: { Wtyp_id: wtyp_id } });

            if (wallets.length > 0) {
                helpers.loggerWarnAndResponse(400,res,"This Wallet Type has associated Wallets. Please delete them first"); return res;
            }

            const deleted = await models.WalletType.destroy({
                where: { Wtyp_id: wtyp_id }
            });
            if (deleted) {
                logger.info("Wallet Type " + findWalletType.Wtyp_name + " deleted");
                return res.status(200).send("Wallet Type " + findWalletType.Wtyp_name + " deleted");
            }
            throw new Error("Specified Wallet Type could not be deleted");
        }
        helpers.loggerWarnAndResponse(404,res,"Specified Wallet Type not found"); return res;
    } catch (error) {
        helpers.loggerErrorAndResponse(res,error.message); return res;
    }
}


async function Transfer(req, res) {
    try {
        const { tra_id } = req.params;
        const findTransfer = await models.Transfer.findOne({ where: { Tra_id: tra_id } });

        if (findTransfer) {
            const movements = await models.Movement.findAll({ where: { Tra_id: findTransfer.Tra_id } });

            if (movements.length > 0) {
                helpers.loggerWarnAndResponse(400,res,"This Transfer has associated Movements. Please delete them first"); return res;
            }

            const deleted = await models.Transfer.destroy({
                where: { Tra_id: tra_id }
            });

            if (deleted) {
                logger.info("Transfer " + findTransfer.Tra_name + " deleted");
                return res.status(200).send("Transfer " + findTransfer.Tra_name + " deleted");
            }
            throw new Error("Specified Transfer could not be deleted");
        }
        helpers.loggerWarnAndResponse(404,res,"Specified Transfer not found"); return res;
    } catch (error) {
        helpers.loggerErrorAndResponse(res,error.message); return res;
    }
}

async function Movement(req, res) {
    try {
        const { username, mov_id } = req.params;
        const findMovement = await models.Movement.findOne({ where: { Mov_id: mov_id } });
        const findUser = await models.User.findOne({ where: { Usr_username: username } });


        if (findUser) {
            if (findMovement) {
                const findWallet = await models.Wallet.findOne({
                    where: {
                        Wal_id: findMovement.Wal_id_sender,
                        Usr_id: findUser.Usr_id
                    }
                });
                if (findWallet) {
                    const deleted = await models.Movement.destroy({
                        where: { Mov_id: mov_id }
                    });
                    if (deleted) {
                        logger.info("Movement deleted.");
                        return res.status(200).send("Movement deleted");
                    }
                }
                helpers.loggerWarnAndResponse(401,res,'This User is not associated with this Movement through Wallet'); return res;
            } else {
                helpers.loggerWarnAndResponse(404,res,'Specified movement does not exist'); return res;
            }
        }
        helpers.loggerWarnAndResponse(404,res,'Given Username does not exists'); return res;
    } catch (error) {
        helpers.loggerErrorAndResponse(res,error.message); return res;
    }
}

async function MovementByTimestamp(req, res) {
    try {
        const { username } = req.params;
        const { timestamp } = req.body;
        const findUser = await models.User.findOne({ where: { Usr_username: username } });
        const findMovement = await models.Movement.findOne({ where: { Mov_timestamp: timestamp } });

        if (findUser) {
            if (findMovement) {
                const findWallet = await models.Wallet.findOne({
                    where: {
                        Wal_id: findMovement.Wal_id_sender,
                        Usr_id: findUser.Usr_id
                    }
                });
                if (findWallet) {
                    const deleted = await models.Movement.destroy({
                        where: { Mov_timestamp: timestamp }
                    });
                    if (deleted) {
                        logger.info("Movement deleted.");
                        return res.status(200).send("Movement deleted");
                    }
                }
                helpers.loggerWarnAndResponse(401,res,'This User is not associated with this Timestamp through Wallet'); return res;
            } else {
                helpers.loggerWarnAndResponse(404,res,'Specified movement does not exists'); return res;
            }
        }
        helpers.loggerWarnAndResponse(404,res,'User does not exists'); return res;
    } catch (error) {
        helpers.loggerErrorAndResponse(res,error.message); return res;
    }
}

async function Enterprise (req, res) {
    try {
        const { ent_id } = req.params;
        const findEnterprise = await models.Enterprise.findOne({ where: { Ent_id: ent_id } });

        if (findEnterprise) {
            const wallets = await models.Wallet.findAll({ where: { Ent_id: ent_id } });
            if (wallets) {
                wallets.forEach(async (element) => {

                    const [updated] = await models.Wallet.update({
                        Ent_id: null
                    }, {
                        where: { Wal_id: element.Wal_id }
                    });

                    if (!updated) {
                        throw new Error("Associated Wallet not updated");
                    }
                });
            }

            const deleted = await models.Enterprise.destroy({
                where: { Ent_id: ent_id }
            });

            if (deleted) {
                logger.info("Enterprise " + findEnterprise.Ent_name + " deleted");
                return res.status(200).send("Enterprise " + findEnterprise.Ent_name + " deleted");
            }
            throw new Error("Specified Enterprise could not be deleted");
        }
        helpers.loggerWarnAndResponse(404,res,"Specified Enterprise not found"); return res;
    } catch (error) { 
        helpers.loggerErrorAndResponse(res,error.message); return res;
    }
}

function Factory() {
    this.delete = (req, res, entity) => {
        switch (entity) {
            case "user":
                User(req, res);
                break;
            case "bank":
                Bank(req, res);
                break;
            case "wallet":
                Wallet(req, res);
                break;
            case "wallet-type":
                WalletType(req, res);
                break;
            case "transfer":
                Transfer(req, res);
                break;
            case "movement":
                Movement(req, res);
                break;
            case "movement-by-timestamp":
                MovementByTimestamp(req, res);
                break;
            case "enterprise":
                Enterprise(req, res);
                break;
            default:
                helpers.loggerWarnAndResponse(404,res,"Unknown route"); return res;
        }
    }
}

module.exports = {
    Factory
}
