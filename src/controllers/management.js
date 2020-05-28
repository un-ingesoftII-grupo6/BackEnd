const helpers = require("../lib/helpers");
const uuid = require('uuid');
const models = require("../../models");

const updateWallet = async (req, res) => {
    try {
        const { wal_id } = req.params;
        const { wallettype,balance,NIT,aOmdOSJma14dna } = req.body;
        const state = helpers.isWalletState(req.body.state); //Limited in the future with new model creation
        const findWtyp = await models.WalletType.findOne({ where: { Wtyp_id: wallettype } });

        if(state == null){
            return res.status(400).send('Not a valid wallet state (Active, Inactive)');
        } else if(!findWtyp){
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


module.exports = {
    updateWallet
}