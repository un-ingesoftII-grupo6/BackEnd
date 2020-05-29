const helpers = require("../lib/helpers");
const uuid = require('uuid');
const models = require("../../models");

const createBank = async (req, res) => {
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

const getAllBanks = async (req, res) => {
    try {
        const banks = await models.Bank.findAll();
        return res.status(200).json({ banks: banks });
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

const updateBank = async (req, res) => {
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

const deleteBank = async (req, res) => {
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
                return res.status(200).send("Bank " + findBank.Bank_name + " deleted");
            }
            throw new Error("Specified Bank could not be deleted");
        }
        return res.status(404).send("Specified Bank not found");
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

module.exports = {
    createBank,
    getAllBanks,
    updateBank, 
    deleteBank
}