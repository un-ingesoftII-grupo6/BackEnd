const helpers = require("../lib/helpers");
const uuid = require('uuid');
const models = require("../../models");
const logger = require("../logger/logger");

async function User(req, res) {
    try {
        const { name, surname, email, password, cpassword, wtyp_id, ent_id } = req.body;
        const username = helpers.hasNoSpaces(req.body.username);

        const findUser = await models.User.findOne({ where: { Usr_username: username } });
        const findWtyp = await models.WalletType.findOne({ where: { Wtyp_id: wtyp_id } });

        if (!findUser) {
            if (username) {
                if (findWtyp) {
                    if (password === cpassword) {
                        const pass = await helpers.encryptPassword(req.body.password);
                        var entId, monthLimit, movementLimit;
                        entId = null;
                        monthLimit = findWtyp.Wtyp_month_limit;
                        movementLimit = findWtyp.Wtyp_movement_limit;
                        if (wtyp_id == 3) {
                            const findEnterprise = await models.Enterprise.findOne({ where: { Ent_id: ent_id } });
                            if (findEnterprise) {
                                entId = ent_id;
                                monthLimit = findEnterprise.Ent_month_limit;
                                movementLimit = findEnterprise.Ent_movement_limit
                            } else {
                                helpers.loggerWarnAndResponse(404, res, 'Specified enterprise not found. Please try again'); return res;
                            }
                        }

                        const user = await models.User.create({
                            Usr_name: name,
                            Usr_surname: surname,
                            Usr_email: email,
                            Usr_username: username,
                            Usr_password: pass
                        });

                        const wallet = await models.Wallet.create({
                            Wal_id: uuid.v4(),
                            Usr_id: user.Usr_id,
                            Wtyp_id: wtyp_id,
                            Ent_id: entId,
                            Wal_balance: 0.00,
                            Wal_state: "Active",
                            Wal_movement_limit: movementLimit,
                            Wal_month_limit: monthLimit
                        });
                        logger.info("Successfully inserted.");
                        return res.status(201).json({
                            user: user,
                            wallet: wallet
                        });
                    }
                    helpers.loggerWarnAndResponse(400, res, "Passwords inserted does not coincide"); return res;
                }
                helpers.loggerWarnAndResponse(404, res, 'Specified wallet type does not exists'); return res;
            }
            helpers.loggerWarnAndResponse(400, res, "Username can't contain spaces"); return res;
        }
        helpers.loggerWarnAndResponse(400, res, "Username is already registered"); return res;
    } catch (error) {
        helpers.loggerErrorAndResponse(res, error.message); return res;
    }
}

async function Bank(req, res) {
    try {
        const { name, description, is_authorized, month_limit, transfer_limit } = req.body;
        const bank = await models.Bank.create({
            Bank_name: name,
            Bank_description: description,
            Bank_is_authorized: is_authorized,
            Bank_month_limit: month_limit,
            Bank_transfer_limit: transfer_limit
        });
        logger.info("Successfully inserted.");
        return res.status(201).json({ bank: bank });
    } catch (error) {
        helpers.loggerErrorAndResponse(res, error.message);
        return res;
    }
}

async function Wallet(req, res) {
    try {
        const username = req.params.username;
        const { wallettype, password, ent_id } = req.body;
        const findUser = await models.User.findOne({ where: { Usr_username: username } });
        const findWtyp = await models.WalletType.findOne({ where: { Wtyp_id: wallettype } });

        if (findUser) {
            if (findWtyp) {
                const val = await helpers.matchPassword(password, findUser.Usr_password);
                if (val) {
                    var entId, monthLimit, movementLimit;
                    entId = null;
                    monthLimit = findWtyp.Wtyp_month_limit;
                    movementLimit = findWtyp.Wtyp_movement_limit;

                    if (wallettype == 3) {
                        const findEnterprise = await models.Enterprise.findOne({ where: { Ent_id: ent_id } });
                        if (findEnterprise) {
                            entId = findEnterprise.Ent_id;
                            monthLimit = findEnterprise.Ent_month_limit;
                            movementLimit = findEnterprise.Ent_movement_limit
                        } else {
                            helpers.loggerWarnAndResponse(404, res, 'Specified enterprise not found. Please try again'); return res;
                        }
                    }

                    const wallet = await models.Wallet.create({
                        Wal_id: uuid.v4(),
                        Usr_id: findUser.Usr_id,
                        Wtyp_id: wallettype,
                        Ent_id: entId,
                        Wal_balance: 0.00,
                        Wal_state: "Active",
                        Wal_movement_limit: movementLimit,
                        Wal_month_limit: monthLimit
                    });
                    logger.info("Successfully inserted.");
                    return res.status(201).json({ wallet: wallet });
                } else {
                    helpers.loggerWarnAndResponse(401, res, 'The password is incorrect. Please try again'); return res;
                }
            } else {
                helpers.loggerWarnAndResponse(404, res, 'Specified wallet type does not exists'); return res;
            }
        }
        helpers.loggerWarnAndResponse(404, res, 'User with specified username does not exists'); return res;
    } catch (error) {
        helpers.loggerErrorAndResponse(res, error.message); return res;
    }
}

async function WalletType(req, res) {
    try {
        const { description, movement_limit, month_limit } = req.body;
        const name = helpers.hasNoSpaces(req.body.name);

        if (name) {
            const wallettype = await models.WalletType.create({
                Wtyp_name: name,
                Wtyp_description: description,
                Wtyp_movement_limit: movement_limit,
                Wtyp_month_limit: month_limit,
            });
            logger.info("Successfully inserted.");
            return res.status(201).json({ wallet_type: wallettype });
        }
        helpers.loggerWarnAndResponse(400, res, "Wallet Type name can't contain spaces"); return res;
    } catch (error) {
        helpers.loggerErrorAndResponse(res, error.message); return res;
    }
}

async function Transfer(req, res) {
    try {
        const { bank_id, name, description, interest } = req.body;
        const route = helpers.hasNoSpaces(req.body.route);
        if (route) {
            const transfer = await models.Transfer.create({
                Bank_id: bank_id,
                Tra_name: name,
                Tra_route: route,
                Tra_description: description,
                Tra_interest_rate: interest
            });
            logger.info("Successfully inserted.");
            return res.status(201).json({ transfer: transfer });
        }
        helpers.loggerWarnAndResponse(400, res, "Route can't contain spaces"); return res;
    } catch (error) {
        helpers.loggerErrorAndResponse(res, error.message); return res;
    }
}

async function Movement(req, res) {
    try {

        const { transfer_type } = req.params;

        const { wal_id_sender, wal_id_recipient, amount, password } = req.body;
        const findSenderWallet = await models.Wallet.findOne({ where: { Wal_id: wal_id_sender } });
        const findRecipientWallet = await models.Wallet.findOne({ where: { Wal_id: wal_id_recipient } });
        var findSender = await models.User.findOne({
            include: [
                {
                    model: models.Wallet,
                    as: "possess",
                    where: { Wal_id: wal_id_sender }
                }
            ]
        });

        if (!findSender) {
            findSender = await models.Enterprise.findOne({
                include: [
                    {
                        model: models.Wallet,
                        as: "manages",
                        where: { Wal_id: wal_id_sender }
                    }
                ]
            });
        }
        var findRecipient = await models.User.findOne({
            include: [
                {
                    model: models.Wallet,
                    as: "possess",
                    where: { Wal_id: wal_id_recipient }
                }
            ]
        });
        if (!findRecipient) {
            findRecipient = await models.Enterprise.findOne({
                include: [
                    {
                        model: models.Wallet,
                        as: "manages",
                        where: { Wal_id: wal_id_recipient }
                    }
                ]
            });
        }
        const findTransfer = await models.Transfer.findOne({ where: { Tra_route: transfer_type } });

        //Note: This function would be customized depending of transfer_type, possible dessign pattern application

        if (findSenderWallet) {
            if (findRecipientWallet) {
                if (findSenderWallet.Wal_id !== findRecipientWallet.Wal_id) {
                    if (amount > 5000) {
                        if (amount % 1000 === 0) {
                            if (findSender) {
                                if (findRecipient) {
                                    if (findTransfer) {
                                        var val;
                                        if(findSenderWallet.Wtyp_id == 2){
                                            val = await helpers.matchPassword(password, findSender.Ent_password);
                                        } else {
                                            val = await helpers.matchPassword(password, findSender.Usr_password);
                                        }
                                        if (val) {
                                            const senderNewBalance = +findSenderWallet.Wal_balance - +amount;
                                            if (senderNewBalance >= 0) {

                                                const updated1 = await models.Wallet.update({
                                                    Wal_balance: senderNewBalance
                                                }, {
                                                    where: { Wal_id: findSenderWallet.Wal_id }
                                                });
                                                const recipientNewBalance = +findRecipientWallet.Wal_balance + +amount;
                                                const updated2 = await models.Wallet.update({
                                                    Wal_balance: recipientNewBalance
                                                }, {
                                                    where: { Wal_id: findRecipientWallet.Wal_id }
                                                });

                                                if (updated1.length > 0 && updated2.length > 0) {

                                                    const movement = await models.Movement.create({
                                                        Tra_id: findTransfer.Tra_id,
                                                        Wal_id_sender: findSenderWallet.Wal_id,
                                                        Wal_id_recipient: findRecipientWallet.Wal_id,
                                                        Mov_total_amount: amount,
                                                        Mov_is_successful: 1,
                                                        Mov_timestamp: new Date()
                                                    });
                                                    logger.info("Successfully inserted.");
                                                    return res.status(201).json({ movement: movement });
                                                }
                                                helpers.loggerErrorAndResponse(res, 'The Wallets could not be actualized'); return res;
                                            }
                                            helpers.loggerWarnAndResponse(401, res, 'The Sender Wallet has no funds for this operation'); return res;
                                        }
                                        helpers.loggerWarnAndResponse(401, res, 'The password is incorrect. Please try again'); return res;
                                    }
                                    helpers.loggerWarnAndResponse(404, res, "Transfer type not found"); return res;
                                }
                                helpers.loggerWarnAndResponse(404, res, "Recipient Username not found"); return res;
                            }
                            helpers.loggerWarnAndResponse(404, res, "Sender Username not found"); return res;
                        }
                        helpers.loggerWarnAndResponse(400, res, "The minimum unit of money you can add is $1000"); return res;
                    }
                    helpers.loggerWarnAndResponse(400, res, "You can't send less than $5000"); return res;
                }
                helpers.loggerWarnAndResponse(400, res, "You can't send money to yourself!"); return res;
            }
            helpers.loggerWarnAndResponse(404, res, "Recipient Wallet not found"); return res;
        }
        helpers.loggerWarnAndResponse(404, res, "Sender Wallet not found"); return res;

    } catch (error) {
        helpers.loggerErrorAndResponse(res, error.message); return res;
    }
}

async function Enterprise(req, res) {
    try {
        const { name, description, budget, movement_limit, month_limit } = req.body;
        const NIT = helpers.hasNoSpaces(req.body.NIT);
        const username = helpers.hasNoSpaces(req.body.username);
        const password = await helpers.encryptPassword(req.body.password);
        if (username) {
            if (NIT) {
                const enterprise = await models.Enterprise.create({
                    Ent_NIT: NIT,
                    Ent_name: name,
                    Ent_description: description,
                    Ent_budget: budget,
                    Ent_username: username,
                    Ent_password: password,
                    Ent_movement_limit: movement_limit,
                    Ent_month_limit: month_limit
                });

                const wallet = await models.Wallet.create({
                    Wal_id: uuid.v4(),
                    Usr_id: null,
                    Wtyp_id: 2,
                    Ent_id: enterprise.Ent_id,
                    Wal_balance: enterprise.Ent_budget,
                    Wal_state: "Active",
                    Wal_movement_limit: enterprise.Ent_movement_limit,
                    Wal_month_limit: enterprise.Ent_month_limit
                });

                logger.info("Successfully inserted.");
                return res.status(201).json({ enterprise: enterprise, wallet: wallet });
            }
            helpers.loggerWarnAndResponse(400, res, "Enterprise NIT can't contain spaces"); return res;
        }
        helpers.loggerWarnAndResponse(400, res, "Enterprise username can't contain spaces"); return res;
    } catch (error) {
        helpers.loggerErrorAndResponse(res, error.message); return res;
    }
}

function Factory() {
    this.create = (req, res, entity) => {
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
            case "enterprise":
                Enterprise(req, res);
                break;
            default:
                helpers.loggerWarnAndResponse(404, res, "Unknown route"); return res;
        }
    }
}

module.exports = {
    Factory
}
