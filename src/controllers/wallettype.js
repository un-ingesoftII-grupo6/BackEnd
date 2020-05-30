const helpers = require("../lib/helpers");
const uuid = require('uuid');
const models = require("../../models");

const createWalletType = async (req, res) => {
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

const getAllWalletTypes = async (req, res) => {
    try {
        const wallettype = await models.WalletType.findAll();
        return res.status(200).json({ wallet_type: wallettype });
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

const updateWalletType = async (req, res) => {
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


const deleteWalletTypeById = async (req, res) => {
    try {
        const { wtyp_id } = req.params;
        const findWalletType = await models.WalletType.findOne({ where: { Wtyp_id: wtyp_id } });

        if (findWalletType) {
            const wallets = await models.Wallet.findAll({ where: { Wtyp_id: wtyp_id } });

            if (wallets.length > 0) {
                return res.status(400).send("This Wallet Type has associated Wallets. Please delete them first");
            }

            const deleted = await models.WalletType.destroy({
                where: { Wtyp_id: wtyp_id }
            });
            if (deleted) {
                return res.status(200).send("Wallet Type " + findWalletType.Wtyp_name + " deleted");
            }
            throw new Error("Specified Wallet Type could not be deleted");
        }
        return res.status(404).send("Specified Wallet Type not found");
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

module.exports = {
    createWalletType,
    getAllWalletTypes,
    updateWalletType,
    deleteWalletTypeById
}