const helpers = require("../lib/helpers");
const uuid = require('uuid');
const models = require("../../models");
const logger = require("../logger/logger");

async function User(req, res) {
    try {
        const users = await models.User.findAll();
        logger.info("Successfully read.");
        return res.status(200).json({ users: users });
    } catch (error) {
        helpers.loggerErrorAndResponse(res,error.message);
    }
}

async function UserByUsername(req, res) {
    try {
        const { username } = req.params;
        const user = await models.User.findOne({
            where: { Usr_username: username }
        });
        if (user) {
            logger.info("Successfully read.");
            return res.status(200).json({ user: user });
        }
        helpers.loggerWarnAndResponse(404,res,'User with the specified username does not exists'); return res;
    } catch (error) {
        helpers.loggerErrorAndResponse(res,error.message); return res;
    }
}

async function ValidateUser(req, res) {
    try {
        const { username, password } = req.body;
        const user = await models.User.findOne({
            where: { Usr_username: username },
            include: [
                {
                    model: models.Wallet,
                    as: 'possess',
                    include: [
                        {
                            model: models.Movement,
                            as: 'modifies_sender',
                        },
                        {
                            model: models.Movement,
                            as: 'modifies_recipient',
                        }
                    ]
                }
            ]
        });
        if (user) {
            const val = await helpers.matchPassword(password, user.Usr_password);
            if (val) {
                logger.info("Successfully read.");
                return res.status(200).json({ user: user }); //Si se autenticó correctamente, le devuelve el user con su wallet
            } else {
                helpers.loggerWarnAndResponse(401,res,'The password is incorrect. Please try again'); return res;
            }

        } else {
            const enterprise = await models.Enterprise.findOne({
                where: { Ent_username: username },
                include: [
                    {
                        model: models.Wallet,
                        as: 'manages',
                        include: [
                            {
                                model: models.Movement,
                                as: 'modifies_sender',
                            },
                            {
                                model: models.Movement,
                                as: 'modifies_recipient',
                            }
                        ]
                    }
                ]
            });
            if(enterprise){
                const val2 = await helpers.matchPassword(password, enterprise.Ent_password);
                if (val2) {
                    logger.info("Successfully read.");
                    return res.status(200).json({ enterprise: enterprise }); //Si se autenticó correctamente, le devuelve la enterprise con su wallet
                } else {
                    helpers.loggerWarnAndResponse(401,res,'The password is incorrect. Please try again'); return res;
                }
            }
             
        }
        helpers.loggerWarnAndResponse(404,res,'User/Enterprise with specified username does not exist'); return res;
    } catch (error) {
        helpers.loggerErrorAndResponse(res,error.message); return res;
    }
}

async function Bank(req, res) {
    try {
        const banks = await models.Bank.findAll();
        logger.info("Successfully read.");
        return res.status(200).json({ banks: banks });
    } catch (error) {
        helpers.loggerErrorAndResponse(res,error.message); return res;
    }
}

async function Wallet(req, res) {
    try {
        const wallets = await models.Wallet.findAll({
            include: [
                {
                    model: models.User,
                    as: 'possess'
                }
            ]
        });
        logger.info("Successfully read.");
        return res.status(200).json({ wallets: wallets });
    } catch (error) {
        helpers.loggerErrorAndResponse(res,error.message); return res;
    }
}

async function WalletsByUsername(req, res) {
    try {
        const username = req.params.username;
        const findUser = await models.User.findOne({ where: { Usr_username: username } });
        if (findUser) {
            const wallets = await models.Wallet.findAll({
                where: { Usr_id: findUser.Usr_id }
            });
            logger.info("Successfully read.");
            return res.status(200).json({ wallets: wallets });
        }
        helpers.loggerWarnAndResponse(404,res,"Specified User not found"); return res;
    } catch (error) {
        helpers.loggerErrorAndResponse(res,error.message); return res;
    }
}

async function WalletType(req, res) {
    try {
        const wallettype = await models.WalletType.findAll();
        logger.info("Successfully read.");
        return res.status(200).json({ wallet_type: wallettype });
    } catch (error) {
        helpers.loggerErrorAndResponse(res,error.message); return res;
    }
}

async function Transfer(req, res) {
    try {
        const transfers = await models.Transfer.findAll();
        logger.info("Successfully read.");
        return res.status(200).json({ transfers: transfers });
    } catch (error) {
        helpers.loggerErrorAndResponse(res,error.message); return res;
    }
}

async function Movement(req, res) {
    try {
        const movements = await models.User.findAll({
            include: [
                {
                    model: models.Wallet,
                    as: 'possess',
                    include: [
                        {
                            model: models.Movement,
                            as: 'modifies_sender'
                        },
                        {
                            model: models.Movement,
                            as: 'modifies_recipient'
                        }
                    ]
                },
            ]
        });
        logger.info("Successfully read.");
        return res.status(200).json({ movements: movements });
    } catch (error) {
        helpers.loggerErrorAndResponse(res,error.message); return res;
    }
}

async function MovementByUsername(req, res) {
    try {
        const username = req.params.username;
        const findUser = await models.User.findOne({ where: { Usr_username: username } });
        const movements = await models.Wallet.findAll({
            where: {
                Usr_id: findUser.Usr_id
            },
            include: [
                {
                    model: models.Movement,
                    as: 'modifies_sender',
                },
                {
                    model: models.Movement,
                    as: 'modifies_recipient',

                }
            ]
        });
        logger.info("Successfully read.");
        return res.status(200).json({ wallets: movements });
    } catch (error) {
        helpers.loggerErrorAndResponse(res,error.message); return res;
    }
}

async function Enterprise(req, res) {
    try {
        const enterprises = await models.Enterprise.findAll();
        logger.info("Successfully read.");
        return res.status(200).json({ enterprises: enterprises });
    } catch (error) {
        helpers.loggerErrorAndResponse(res,error.message); return res;
    }
}

async function EnterpriseByUsername(req, res) {
    try {
        const { username } = req.params;
        const enterprise = await models.Enterprise.findOne({
            where: { Ent_username: username }
        });
        if (enterprise) {
            logger.info("Successfully read.");
            return res.status(200).json({ enterprise: enterprise });
        }
        helpers.loggerWarnAndResponse(404,res,'Enterprise username does not exist'); return res;
    } catch (error) {
        helpers.loggerErrorAndResponse(res,error.message); return res;
    }
}

async function UserManagedByEnterprise(req, res) {
    try {
        const username = req.params.username;
        const findEnterprise = await models.Enterprise.findOne({ where: { Ent_username: username } });
        if(findEnterprise){
        const users = await models.Wallet.findAll({
            where: {
                Ent_id: findEnterprise.Ent_id
            },
            include: [
                {
                    model: models.User,
                    as: 'possess',
                },
                {
                    model: models.Movement,
                    as: 'modifies_sender',

                },
                {
                    model: models.Movement,
                    as: 'modifies_recipient',

                }
            ]
        });
        if(users){
            logger.info("Successfully read.");
            return res.status(200).json({ users: users });
            } else {
                helpers.loggerWarnAndResponse(404,res,"No Managed Users found for this Enterprise"); return res;
            }
    } 
    helpers.loggerWarnAndResponse(404,res,"This Enterprise Username does not exist"); return res;
    } catch (error) {
        helpers.loggerErrorAndResponse(res,error.message); return res;
    }
}

function Factory() {
    this.read = (req, res, entity) => {
        switch (entity) {
            case "user":
                User(req, res);
                break;
            case "user-by-username":
                UserByUsername(req, res);
                break;
            case "user-validate":
                ValidateUser(req, res);
                break;
            case "bank":
                Bank(req, res);
                break;
            case "wallet":
                Wallet(req, res);
                break;
            case "wallet-by-username":
                WalletsByUsername(req, res);
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
            case "movement-by-username":
                MovementByUsername(req, res);
                break;
            case "enterprise":
                Enterprise(req, res);
                break;
            case "enterprise-validate":
                    ValidateUser(req, res);
                break;
            case "enterprise-by-username":
                    EnterpriseByUsername(req, res);
                break;
            case "managed-users":
                    UserManagedByEnterprise(req, res);
                break;
            default:
                helpers.loggerWarnAndResponse(404,res,"Unknown route"); return res;
        }
    }
}

module.exports = {
    Factory
}
