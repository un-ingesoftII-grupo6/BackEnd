const helpers = require("../lib/helpers");
const uuid = require('uuid');
const models = require("../../models");

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
                return res.status(200).json({ user: updatedUser });
            }
            throw new Error('User not updated');
        }
        return res.status(400).send("Username can't contain spaces");
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

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
                return res.status(200).json({ bank: updatedBank });
            }
            return res.status(400).send("Not updated: Update data is the same");
        }
        return res.status(404).send("Bank not found");
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

async function Wallet(req, res) {
    try {
        const { wal_id } = req.params;
        const { wallettype, balance, NIT } = req.body;
        const state = helpers.isWalletState(req.body.state); //Limited in the future with new model creation
        const findWtyp = await models.WalletType.findOne({ where: { Wtyp_id: wallettype } });

        if (state == null) {
            return res.status(400).send('Not a valid wallet state (Active, Inactive)');
        } else if (!findWtyp) {
            return res.status(400).send('Not a valid wallet type');
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
            return res.status(200).json({ wallet: updatedWallet });
        } else if (updatedWallet) {
            return res.status(400).send("Not updated: Update data is the same");
        }
        return res.status(404).send("Wallet not found");
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

async function WalletState(req, res) {
    try {
        const { username, wal_id } = req.params;
        const findUser = await models.User.findOne({ where: { Usr_username: username } });
        const findWallet = await models.Wallet.findOne({ where: { Usr_id: findUser.Usr_id, Wal_id: wal_id } });
        const state = helpers.isWalletState(req.body.state);
        const { password } = req.body;
        if (findUser) {
            if (findWallet) {
                const val = await helpers.matchPassword(password, findUser.Usr_password);
                if (val) {
                    if (state == null) {
                        return res.status(400).send('Not a valid wallet state (Active, Inactive)');
                    }
                } else {
                    return res.status(401).send('The password is incorrect. Please try again');
                }
            } else {
                return res.status(401).send('The User does not own this wallet');
            }
        } else {
            return res.status(404).send('User not found');
        }

        const [updated] = await models.Wallet.update({
            Wal_state: state
        }, {
            where: { Wal_id: wal_id }
        });

        const updatedWallet = await models.Wallet.findOne({ where: { Wal_id: wal_id } });
        if (updated) {
            return res.status(200).json({ wallet: updatedWallet });
        } else if (updatedWallet) {
            return res.status(400).send("Not updated: Update data is the same");
        }
        return res.status(404).send("Wallet not found");
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

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
                    return res.status(200).json({ wallet_type: updatedWalletType });
                }
                return res.status(400).send("Not updated: Update data is the same");
            }
            return res.status(400).send("Wallet Type name can't contain spaces");
        }
        return res.status(404).send("Wallet Type not found");
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

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
                return res.status(200).json({ transfer: updatedTransfer });
            }
            return res.status(400).send("Not updated: Update data is the same");
        }
        return res.status(404).send("Transfer not found");
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

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
                        return res.status(200).json({ transfer: updatedTransfer });
                    }
                    return res.status(400).send("Not updated: Update data is the same");
                }
                return res.status(401).send('The password is incorrect. Please try again');
            }
            return res.status(400).send("Enterprise username can't contain spaces");
        }
        return res.status(404).send("Enterprise not found");
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

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