const helpers = require("../lib/helpers");
const uuid = require('uuid');
const models = require("../../models");

const createWallet = async (req, res) => {
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

const getAllWalletsByUsername = async (req, res) => {
    try {
        const username = req.params.username;
        const findUser = await models.User.findOne({ where: { Usr_username: username } });
    if(findUser){
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

const getAllWallets = async (req, res) => {
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

const updateWallet = async (req, res) => {
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

const updateWalletState = async (req, res) => {
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


const deleteWallet = async (req, res) => {
    try {
        const { username, wal_id } = req.params;
        const { password } = req.body;
        const findUser = await models.User.findOne({ where: { Usr_username: username } });
        const findWallet = await models.Wallet.findOne({ where: { Wal_id: wal_id } });

        if (findUser) {
            if (findWallet) {
                const movement_sender = await models.Movement.findAll({ where: { Wal_id_sender: wal_id } });
                const movement_recipient = await models.Movement.findAll({ where: { Wal_id_recipient: wal_id } });

                if (movement_sender.length > 0 || movement_recipient.length > 0 ) {
                    return res.status(400).send("This Wallet has associated Movements. Please delete them first");
                }
                const val = await helpers.matchPassword(password, findUser.Usr_password);
                if (val) {
                    const deleted = await models.Wallet.destroy({
                        where: { Wal_id: wal_id }
                    });
                    if (deleted) {
                        return res.status(200).send("Wallet deleted");
                    }
                } else {
                    return res.status(401).send('The password is incorrect. Please try again');
                }
            } else {
                return res.status(404).send('Specified wallet does not exists');
            }
        }
        return res.status(404).send('User does not exists');
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

module.exports = {
    createWallet,
    getAllWallets,
    updateWallet,
    updateWalletState,
    getAllWalletsByUsername,
    deleteWallet
}