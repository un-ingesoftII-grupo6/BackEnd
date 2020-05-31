const helpers = require("../lib/helpers");
const uuid = require('uuid');
const models = require("../../models");

async function User(req, res) {
    try {
        const { name, surname, email } = req.body;
        const username = helpers.hasNoSpaces(req.body.username);
        const password = await helpers.encryptPassword(req.body.password);

        if (username) {
            const user = await models.User.create({
                Usr_name: name,
                Usr_surname: surname,
                Usr_email: email,
                Usr_username: username,
                Usr_password: password
            });

            const wallet = await models.Wallet.create({
                Wal_id: uuid.v4(),
                Usr_id: user.Usr_id,
                Wtyp_id: 1,
                Wal_balance: 0.00,
                Wal_state: "Active"
            });

            return res.status(201).json({
                user: user,
                wallet: wallet
            });
        }
        return res.status(400).send("Username can't contain spaces");
    } catch (error) {
        return res.status(500).json({ error: error.message })
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
        return res.status(201).json({ bank: bank });
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

async function Wallet(req, res) {
    try {
        const username = req.params.username;
        const { wallettype, password } = req.body;
        const findUser = await models.User.findOne({ where: { Usr_username: username } });
        const findWtyp = await models.WalletType.findOne({ where: { Wtyp_id: wallettype } });

        if (findUser) {
            if (findWtyp) {
                const val = await helpers.matchPassword(password, findUser.Usr_password);
                if (val) {
                    const wallet = await models.Wallet.create({
                        Wal_id: uuid.v4(),
                        Usr_id: findUser.Usr_id,
                        Wtyp_id: wallettype,
                        Wal_balance: 0.00,
                        Wal_state: "Active"
                    });
                    return res.status(201).json({ wallet: wallet });
                } else {
                    return res.status(401).send('The password is incorrect. Please try again');
                }
            } else {
                return res.status(404).send('Specified wallet type does not exists');
            }
        }
        return res.status(404).send('User with specified username does not exists');
    } catch (error) {
        return res.status(500).json({ error: error.message })
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
            return res.status(201).json({ wallet_type: wallettype });
        }
        return res.status(400).send("Wallet Type name can't contain spaces");
    } catch (error) {
        return res.status(500).json({ error: error.message })
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
            return res.status(201).json({ transfer: transfer });
        }
        return res.status(400).send("Route can't contain spaces");
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

async function Movement(req, res) {
    try {

        const { transfer_type } = req.params;

        const { wal_id_sender, wal_id_recipient, amount, password } = req.body;
        const findSenderWallet = await models.Wallet.findOne({ where: { Wal_id: wal_id_sender } });
        const findRecipientWallet = await models.Wallet.findOne({ where: { Wal_id: wal_id_recipient } });
        const findSender = await models.User.findOne({
            include: [
                {
                    model: models.Wallet,
                    as: "possess",
                    where: { Wal_id: wal_id_sender }
                }
            ]
        });
        const findRecipient = await models.User.findOne({
            include: [
                {
                    model: models.Wallet,
                    as: "possess",
                    where: { Wal_id: wal_id_recipient }
                }
            ]
        });
        const findTransfer = await models.Transfer.findOne({ where: { Tra_route: transfer_type } });

        //Note: This function would be customized depending of transfer_type, possible dessign pattern application

        if (findSender) {
            if (findRecipient) {
                if (findTransfer) {
                    if (findSenderWallet) {
                        if (findRecipientWallet) {
                            const val = await helpers.matchPassword(password, findSender.Usr_password);
                            if (val) {
                                const senderNewBalance = findSenderWallet.Wal_balance - amount;
                                if (senderNewBalance >= 0) {

                                    const updated1 = await models.Wallet.update({
                                        Wal_balance: senderNewBalance
                                    }, {
                                        where: { Wal_id: findSenderWallet.Wal_id }
                                    });
                                    const recipientNewBalance = findRecipientWallet.Wal_balance + amount;
                                    const updated2 = await models.Wallet.update({
                                        Wal_balance: recipientNewBalance
                                    }, {
                                        where: { Wal_id: findRecipientWallet.Wal_id }
                                    });

                                    if(updated1.length > 0 && updated2.length > 0){

                                        const movement = await models.Movement.create({
                                            Tra_id: findTransfer.Tra_id,
                                            Wal_id_sender: findSenderWallet.Wal_id,
                                            Wal_id_recipient: findRecipientWallet.Wal_id,
                                            Mov_total_amount: amount,
                                            Mov_is_successful: 0,
                                            Mov_timestamp: new Date()
                                        });
                                        return res.status(201).json({ movement: movement });
                                    }
                                    return res.status(500).send('The Wallets could not be actualized');
                                }
                                return res.status(401).send('The Sender Wallet has no funds for this operation');
                            }
                            return res.status(401).send('The password is incorrect. Please try again');
                        }
                        return res.status(404).send("Recipient Wallet not found");
                    }
                    return res.status(404).send("Sender Wallet not found");
                }
                return res.status(404).send("Transfer type not found");
            }
            return res.status(404).send("Recipient Username not found");
        } else {
            return res.status(404).send("Sender Username not found");
        }

    } catch (error) {
        return res.status(500).send(error.message);
    }
}

async function Enterprise(req, res) {
    try {
        const { name, description, budget } = req.body;
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
                    Ent_password: password
                });
                return res.status(201).json({ enterprise: enterprise });
            }
            return res.status(400).send("Enterprise NIT can't contain spaces");
        }
        return res.status(400).send("Enterprise username can't contain spaces");
    } catch (error) {
        return res.status(500).json({ error: error.message })
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
                return res.status(404).send("Unknown route");
        }
    }
}

module.exports = {
    Factory
}
