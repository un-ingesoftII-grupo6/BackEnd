const helpers = require("../lib/helpers");
const uuid = require('uuid');
const models = require("../../models");

async function User(req, res) {
    try {
        const users = await models.User.findAll();
        return res.status(200).json({ users: users });
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

async function UserByUsername(req, res) {
    try {
        const { username } = req.params;
        const user = await models.User.findOne({
            where: { Usr_username: username }
        });
        if (user) {
            return res.status(200).json({ user: user });
        }
        return res.status(404).send('User with the specified username does not exists');
    } catch (error) {
        return res.status(500).send(error.message);
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
                return res.status(200).json({ user: user }); //Si se autenticó correctamente, le devuelve el user con su wallet
            } else {
                return res.status(401).send('The password is incorrect. Please try again');
            }

        }
        return res.status(404).send('User with specified username does not exist');
    } catch (error) {
        return res.status(500).send("Error: "+error.message);
    }
}

async function Bank(req, res) {
    try {
        const banks = await models.Bank.findAll();
        return res.status(200).json({ banks: banks });
    } catch (error) {
        return res.status(500).send(error.message);
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
        return res.status(200).json({ wallets: wallets });
    } catch (error) {
        return res.status(500).send(error.message);
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
            return res.status(200).json({ wallets: wallets });
        }
        return res.status(404).send("Specified User not found");
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

async function WalletType(req, res) {
    try {
        const wallettype = await models.WalletType.findAll();
        return res.status(200).json({ wallet_type: wallettype });
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

async function Transfer(req, res) {
    try {
        const transfers = await models.Transfer.findAll();
        return res.status(200).json({ transfers: transfers });
    } catch (error) {
        return res.status(500).send(error.message);
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
        return res.status(200).json({ movements: movements });
    } catch (error) {
        return res.status(500).send(error.message);
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
        return res.status(200).json({ wallets: movements });
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

async function Enterprise(req, res) {
    try {
        const enterprises = await models.Enterprise.findAll();
        return res.status(200).json({ enterprises: enterprises });
    } catch (error) {
        return res.status(500).send(error.message);
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
            default:
                return res.status(404).send("Unknown route");
        }
    }
}

module.exports = {
    Factory
}
