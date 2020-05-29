const helpers = require("../lib/helpers");
const uuid = require('uuid');
const models = require("../../models");

const createEnterprise = async (req, res) => {
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

const getAllEnterprises = async (req, res) => {
    try {
        const enterprises = await models.Enterprise.findAll();
        return res.status(200).json({ enterprises: enterprises });
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

const updateEnterprise = async (req, res) => {
    try {
        const { NIT: ent_id } = req.params;
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
                        const updatedTransfer = await models.Enterprise.findOne({ where: { Ent_id: ent_id} });
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

const deleteEnterprise = async (req, res) => {
    try {
        const { NIT } = req.params;
        const findEnterprise = await models.Enterprise.findOne({ where: { Ent_NIT: NIT } });

        if (findEnterprise) {
            const wallets = await models.Wallet.findAll({ where: { Ent_NIT: NIT } });
            if (wallets) {
                wallets.forEach(async (element) => {

                    const [updated] = await models.Wallet.update({
                        Ent_NIT: null
                    }, {
                        where: { Wal_id: element.Wal_id }
                    });

                    if (!updated) {
                        throw new Error("Associated Wallet not updated");
                    }
                });
            }

            const deleted = await models.Enterprise.destroy({
                where: { Ent_NIT: NIT }
            });

            if (deleted) {
                return res.status(200).send("Enterprise " + findEnterprise.Ent_name + " deleted");
            }
            throw new Error("Specified Enterprise could not be deleted");
        }
        return res.status(404).send("Specified Enterprise not found");
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

module.exports = {
    createEnterprise,
    getAllEnterprises,
    updateEnterprise,
    deleteEnterprise
}