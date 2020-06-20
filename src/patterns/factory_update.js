const helpers = require("../lib/helpers");
const uuid = require('uuid');
const models = require("../../models");
const logger = require("../logger/logger");

async function User(req, res) {
    try {
        const { username } = req.params;
        const usrname = helpers.hasNoSpaces(req.body.username);
        const { name, surname, email } = req.body;
        const password = await helpers.encryptPassword(req.body.password);

        if (usrname) {
            const [updated] = await models.User.update({
                Usr_name: name,
                Usr_surname: surname,
                Usr_email: email,
                Usr_username: usrname,
                Usr_password: password
            }, {
                where: { Usr_username: username }
            });
            if (updated) {
                const updatedUser = await models.User.findOne({ where: { Usr_username: usrname } });
                logger.info("Successfully updated.");
                return res.status(200).json({ user: updatedUser });
            }
            throw new Error('User not updated');
        }
        helpers.loggerWarnAndResponse(400,res,"Username can't contain spaces"); return res;
    } catch (error) {
        helpers.loggerErrorAndResponse(res,error.message); return res;
    }
}

async function Bank(req, res) {
    try {
        const { bank_id } = req.params;
        const findBank = await models.Bank.findOne({ where: { Bank_id: bank_id } })
        const { description, is_authorized, month_limit, transfer_limit } = req.body;

        if (findBank) {
            const [updated] = await models.Bank.update({
                Bank_description: description,
                Bank_is_authorized: is_authorized,
                Bank_month_limit: month_limit,
                Bank_transfer_limit: transfer_limit
            }, {
                where: { Bank_id: bank_id }
            });
            if (updated) {
                const updatedBank = await models.Bank.findOne({ where: { Bank_id: bank_id } });
                logger.info("Successfully updated.");
                return res.status(200).json({ bank: updatedBank });
            }
            helpers.loggerWarnAndResponse(400,res,"Not updated: Update data is the same"); return res;
        }
        helpers.loggerWarnAndResponse(404,res,"Bank not found"); return res;
    } catch (error) {
        helpers.loggerErrorAndResponse(res,error.message); return res;
    }
}

async function Wallet(req, res) {
    try {
        const { wal_id } = req.params;
        const { wallettype, balance, NIT } = req.body;
        const state = helpers.isWalletState(req.body.state); //Limited in the future with new model creation
        const findWtyp = await models.WalletType.findOne({ where: { Wtyp_id: wallettype } });

        if (state == null) {
            helpers.loggerWarnAndResponse(400,res,'Not a valid wallet state (Active, Inactive)'); return res;
        } else if (!findWtyp) {
            helpers.loggerWarnAndResponse(400,res,'Not a valid wallet type'); return res;
        }

        const [updated] = await models.Wallet.update({
            Wtyp_id: wallettype,
            Ent_NIT: NIT,
            Wal_balance: balance,
            Wal_state: state
        }, {
            where: { Wal_id: wal_id }
        });

        const updatedWallet = await models.Wallet.findOne({ where: { Wal_id: wal_id } });
        if (updated) {
            logger.info("Successfully updated.");
            return res.status(200).json({ wallet: updatedWallet });
        } else if (updatedWallet) {
            helpers.loggerWarnAndResponse(400,res,"Not updated: Update data is the same"); return res;
        }
        helpers.loggerWarnAndResponse(404,res,"Wallet not found"); return res;
    } catch (error) {
        helpers.loggerErrorAndResponse(res,error.message); return res;
    }
}

async function WalletState(req, res) {
    try {
        const { username, wal_id } = req.params;
        const findUser = await models.User.findOne({ where: { Usr_username: username } });
        const findWallet = await models.Wallet.findOne({ where: { Usr_id: findUser.Usr_id, Wal_id: wal_id } });
        const state = helpers.isWalletState(req.body.state);
        const { password, new_month_limit,new_movement_limit } = req.body;
        if (findUser) {
            if (findWallet) {
                    var val;
                if(findWallet.Ent_id != null){
                    const findEnterprise = await models.Enterprise.findOne({ where: { Ent_id: findWallet.Ent_id } });
                    val = await helpers.matchPassword(password, findEnterprise.Ent_password);
                }else{
                    val = await helpers.matchPassword(password, findUser.Usr_password);
                }
                if (val) {
                    if (state == null) {
                        helpers.loggerWarnAndResponse(400,res,'Not a valid wallet state (Active, Inactive)'); return res;
                    }
                } else {
                    helpers.loggerWarnAndResponse(401,res,'The password is incorrect. Please try again'); return res;
                }
            } else {
                helpers.loggerWarnAndResponse(401,res,'The User does not own this wallet'); return res;
            }
        } else {
            helpers.loggerWarnAndResponse(404,res,'User not found'); return res;
        }
        var monthLimit, movementLimit;
        monthLimit = findWallet.Wtyp_month_limit;
        movementLimit = findWallet.Wtyp_movement_limit;
        if (findWallet.Wtyp_id == 3) {
            const findEnterprise = await models.Enterprise.findOne({ where: { Ent_id: findWallet.Ent_id } });
            if (findEnterprise) {
                monthLimit = new_month_limit;
                movementLimit = new_movement_limit;
            } else{
            helpers.loggerWarnAndResponse(404, res, 'Enterprise registered in wallet not found. Please try again'); return res;
            }
        }
        const [updated] = await models.Wallet.update({
            Wal_state: state,
            Wal_movement_limit: movementLimit,
            Wal_month_limit: monthLimit
        }, {
            where: { Wal_id: wal_id }
        });

        const updatedWallet = await models.Wallet.findOne({ where: { Wal_id: wal_id } });
        if (updated) {
            logger.info("Successfully updated.");
            return res.status(200).json({ wallet: updatedWallet });
        } else if (updatedWallet) {
            helpers.loggerWarnAndResponse(400,res,"Not updated: Update data is the same"); return res;
        }
        helpers.loggerWarnAndResponse(404,res,"Wallet not found"); return res;
    } catch (error) {
        helpers.loggerErrorAndResponse(res,error.message); return res;
    }
}

async function WalletType(req, res) {
    try {
        const { wtyp_id } = req.params;
        const findWalletType = await models.WalletType.findOne({ where: { Wtyp_id: wtyp_id } })
        const { description, movement_limit, month_limit } = req.body;
        if (findWalletType) {
            const name = helpers.hasNoSpaces(req.body.name);
            if (name) {
                const [updated] = await models.WalletType.update({
                    Wtyp_name: name,
                    Wtyp_description: description,
                    Wtyp_movement_limit: movement_limit,
                    Wtyp_month_limit: month_limit,
                }, {
                    where: { Wtyp_id: wtyp_id }
                });
                if (updated) {
                    const updatedWalletType = await models.WalletType.findOne({ where: { Wtyp_id: wtyp_id } });
                    logger.info("Successfully updated.");
                    return res.status(200).json({ wallet_type: updatedWalletType });
                }
                helpers.loggerWarnAndResponse(400,res,"Not updated: Update data is the same"); return res;
            }
            helpers.loggerWarnAndResponse(400,res,"Wallet Type name can't contain spaces"); return res;
        }
        helpers.loggerWarnAndResponse(404,res,"Wallet Type not found"); return res;
    } catch (error) {
        helpers.loggerErrorAndResponse(res,error.message); return res;
    }
}

async function Transfer(req, res) {
    try {
        const { tra_id } = req.params;
        const findTransfer = await models.Transfer.findOne({ where: { Tra_id: tra_id } })
        const { bank_id, name, description, interest } = req.body;

        if (findTransfer) {
            const [updated] = await models.Transfer.update({
                Bank_id: bank_id,
                Tra_name: name,
                Tra_description: description,
                Tra_interest_rate: interest
            }, {
                where: { Tra_id: tra_id }
            });
            if (updated) {
                const updatedTransfer = await models.Transfer.findOne({ where: { Tra_id: tra_id } });
                logger.info("Successfully updated.");
                return res.status(200).json({ transfer: updatedTransfer });
            }
            helpers.loggerWarnAndResponse(400,res,"Not updated: Update data is the same"); return res;
        }
        helpers.loggerWarnAndResponse(404,res,"Transfer not found"); return res;
    } catch (error) {
        helpers.loggerErrorAndResponse(res,error.message); return res;
    }
}

async function Enterprise(req, res) {
    try {
        const { ent_id } = req.params;
        const findEnterprise = await models.Enterprise.findOne({ where: { Ent_id: ent_id } })
        const { name, description, budget } = req.body;
        if (findEnterprise) {
            const username = helpers.hasNoSpaces(req.body.username);
            if (username) {
                const val = await helpers.matchPassword(req.body.old_password, findEnterprise.Ent_password);
                if (val) {
                    const new_password = await helpers.encryptPassword(req.body.new_password);

                    const [updated] = await models.Enterprise.update({
                        Ent_name: name,
                        Ent_description: description,
                        Ent_budget: budget,
                        Ent_username: username,
                        Ent_password: new_password
                    }, {
                        where: { Ent_id: ent_id }
                    });
                    if (updated) {
                        const updatedTransfer = await models.Enterprise.findOne({ where: { Ent_id: ent_id } });
                        logger.info("Successfully updated.");
                        return res.status(200).json({ transfer: updatedTransfer });
                    }
                    helpers.loggerWarnAndResponse(400,res,"Not updated: Update data is the same"); return res;
                }
                helpers.loggerWarnAndResponse(401,res,'The password is incorrect. Please try again'); return res;
            }
            helpers.loggerWarnAndResponse(400,res,"Enterprise username can't contain spaces"); return res;
        }
        helpers.loggerWarnAndResponse(404,res,"Enterprise not found"); return res;
    } catch (error) {
        helpers.loggerErrorAndResponse(res,error.message); return res;
    }
}

function Factory() {
    this.update = (req, res, entity) => {
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
            case "wallet-state":
                WalletState(req, res);
                break;
            case "wallet-type":
                WalletType(req, res);
                break;
            case "transfer":
                Transfer(req, res);
                break;
/*          case "movement":           //A movement can't be updated now in the sistem
                Movement(req, res);
                break;
*/          case "enterprise":
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