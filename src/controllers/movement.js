const helpers = require("../lib/helpers");
const uuid = require('uuid');
const models = require("../../models");

const createMovement = async (req, res) => {
    try {

        const { transfer_type } = req.params;

        const { wal_id_sender, wal_id_recipient, amount } = req.body;
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
                            const movement = await models.Movement.create({
                                Tra_id: findTransfer.Tra_id,
                                Wal_id_sender: findSenderWallet.Wal_id,
                                Wal_id_recipient: findRecipientWallet.Wal_id,
                                Mov_total_amount: amount,
                                Mov_is_successful: 0,
                                Mov_timestamp: new Date()
                            });

                            //Here is possible to call updateWallet function to commit changes in db

                            return res.status(201).json({ movement: movement });
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

const getAllMovementsByUsername = async (req, res) => {
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

const getAllMovements = async (req, res) => {
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

const deleteMovementbyTimestamp = async (req, res) => {
    try {
        const { username } = req.params;
        const { timestamp } = req.body;
        const findUser = await models.User.findOne({ where: { Usr_username: username } });
        const findMovement = await models.Movement.findOne({ where: { Mov_timestamp: timestamp } });

        if (findUser) {
            if (findMovement) {
                const findWallet = await models.Wallet.findOne({ where: { 
                    Wal_id: findMovement.Wal_id_sender, 
                    Usr_id: findUser.Usr_id 
                } });
                if(findWallet){
                    const deleted = await models.Movement.destroy({
                        where: { Mov_timestamp: timestamp }
                    });
                    if (deleted) {
                        return res.status(200).send("Movement deleted");
                    }
                }
                return res.status(401).send('This User is not associated with this Timestamp through Wallet');
            } else {
                return res.status(404).send('Specified movement does not exists');
            }
        }
        return res.status(404).send('User does not exists');
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

const deleteMovementbyMovId = async (req, res) => {
    try {
        const { username,mov_id } = req.params;
        const findMovement = await models.Movement.findOne({ where: { Mov_id: mov_id } });
        const findUser = await models.User.findOne({ where: { Usr_username: username } });
        
    
        if (findUser) {
            if (findMovement) {
                const findWallet = await models.Wallet.findOne({ where: { 
                    Wal_id: findMovement.Wal_id_sender, 
                    Usr_id: findUser.Usr_id 
                } });
                if(findWallet){
                    const deleted = await models.Movement.destroy({
                        where: { Mov_id: mov_id }
                    });
                    if (deleted) {
                        return res.status(200).send("Movement deleted");
                    }
                }
                return res.status(401).send('This User is not associated with this Movement through Wallet');
            } else {
                return res.status(404).send('Specified movement does not exist');
            }
        }
        return res.status(404).send('Given Username does not exists');
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

module.exports = {
    createMovement,
    getAllMovementsByUsername,
    getAllMovements,
    deleteMovementbyTimestamp,
    deleteMovementbyMovId
}