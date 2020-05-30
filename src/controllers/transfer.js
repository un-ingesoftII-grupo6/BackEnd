const helpers = require("../lib/helpers");
const uuid = require('uuid');
const models = require("../../models");

const createTransfer = async (req, res) => {
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

const getAllTransfers = async (req, res) => {
    try {
        const transfers = await models.Transfer.findAll();
        return res.status(200).json({ transfers: transfers });
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

const updateTransfer = async (req, res) => {
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

const deleteTransfer = async (req, res) => {
    try {
        const { tra_id } = req.params;
        const findTransfer = await models.Transfer.findOne({ where: { Tra_id: tra_id } });

        if (findTransfer) {
            const movements = await models.Movement.findAll({ where: { Tra_id: findTransfer.Tra_id } });

            if (movements.length > 0) {
                return res.status(400).send("This Transfer has associated Movements. Please delete them first");
            }

            const deleted = await models.Transfer.destroy({
                where: { Tra_id: tra_id }
            });

            if (deleted) {
                return res.status(200).send("Transfer " + findTransfer.Tra_name + " deleted");
            }
            throw new Error("Specified Transfer could not be deleted");
        }
        return res.status(404).send("Specified Transfer not found");
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

module.exports = {
    createTransfer,
    getAllTransfers,
    updateTransfer,
    deleteTransfer
}