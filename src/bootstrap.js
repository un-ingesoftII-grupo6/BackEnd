const helpers = require("./lib/helpers");

module.exports = async () => {

    const Bank = require("./models/Bank");
    const Enterprise = require("./models/Enterprise");
    const Movement = require("./models/Movement");
    const Transfer = require("./models/Transfer");
    const User = require("./models/User");
    const Wallet = require("./models/Wallet");
    const WalletType = require("./models/WalletType");

    //Relationships
    //User (1:n) Wallet
    User.hasMany(Wallet, { as: "possess", foreignKey: 'Usr_id' });
    Wallet.belongsTo(User, { as: "possess", foreignKey: "Usr_id" });
    //WalletType (0:n) Wallet
    WalletType.hasMany(Wallet, { as: "give roles", foreignKey: "Wtyp_id" });
    Wallet.belongsTo(WalletType, { as: "give roles", foreignKey: "Wtyp_id" });
    //Enterprise (0:n) Wallet
    Enterprise.hasMany(Wallet, { as: "manages", foreignKey: "Ent_NIT" });
    Wallet.belongsTo(Enterprise, { as: "manages", foreignKey: "Ent_NIT" });
    //Wallet (0:n) Movement
    Wallet.hasMany(Movement, { as: "modifies", foreignKey: "Wal_id" });
    Movement.belongsTo(Wallet, { as: "modifies", foreignKey: "Wal_id" });
    //Transfer (0:n) Movement
    Transfer.hasMany(Movement, { as: "is given", foreignKey: "Tra_id" });
    Movement.belongsTo(Transfer, { as: "is given", foreignKey: "Tra_id" });
    //Bank (0:n) Transfer
    Bank.hasMany(Transfer, { as: "is authorized", foreignKey: "Bank_name" });
    Transfer.belongsTo(Bank, { as: "is authorized", foreignKey: "Bank_name" });

    //Exceptions handler
    const errHandler = err => {
        console.log("Error: ", err);
    };

    //Inserting data

    //Local created instances
    const pass = await helpers.encryptPassword("Abcd1234");
    const user = await User.build({
        Usr_id: 1,
        Usr_name: "Miguel",
        Usr_surname: "Peña",
        Usr_email: "miapenahu@unal.edu.co",
        Usr_username: "miapenahu",
        Usr_password: pass
    })//.catch(errHandler);

    const walletType = await WalletType.build({
        Wtyp_id: 1,
        Wtyp_name: "Personal",
        Wtyp_description: "This is a personal wallet",
        Wtyp_movement_limit: 4000000.00,
        Wtyp_month_limit: 2000000.00
    })//.catch(errHandler);

    const enterprise = await Enterprise.build({
        Ent_NIT: "enterprise-1",
        Ent_name: "Empresa 1",
        Ent_budget: 100000000.00,
        Ent_username: "enterprise1",
        Ent_password: "enterprise1"
    })//.catch(errHandler);

    const wallet = await Wallet.build({
        Wal_id: "abcd1234",
        Usr_id: user.Usr_id,
        Wtyp_id: walletType.Wtyp_id,
        Ent_NIT: enterprise.Ent_NIT,
        Wal_balance: 500000.00,
        Wal_state: "Active"
    })//.catch(errHandler);

    const bank = await Bank.build({
        Bank_name: "Bancolombia",
        Bank_description: "Banco colombiano",
        Bank_is_authorized: 1,
        Bank_month_limit: 5000000.00,
        Bank_transfer_limit: 10000000.00
    })//.catch(errHandler);

    const transfer = await Transfer.build({
        Tra_id: 1,
        Bank_name: bank.Bank_name,
        Tra_name: "Envío dinero",
        Tra_description: "Envío de dinero entre dos personas normales",
        Tra_interest_rate: 2
    })//.catch(errHandler);

    const movement = await Movement.build({
        Tra_id: transfer.Tra_id,
        Wal_id: wallet.Wal_id,
        Mov_sender: 12345,
        Mov_recipient: 54321,
        Mov_total_amount: 50000.00,
        Mov_date: "2002-04-27",
        Mov_time: "20:00",
        Mov_is_successful: 1,
        Mov_timestamp: null
    })//.catch(errHandler);

    //Find or create in the DB
    const user_arr = await User.findOrCreate({where: {
        Usr_id: user.Usr_id,
        Usr_name: user.Usr_name,
        Usr_surname: user.Usr_surname,
        Usr_email: user.Usr_email,
        Usr_username: user.Usr_username,
        Usr_password: user.Usr_password
    }}).catch(errHandler);

    const walletType_arr = await WalletType.findOrCreate({where: {
        Wtyp_id: walletType.Wtyp_id,
        Wtyp_name: walletType.Wtyp_name,
        Wtyp_description: walletType.Wtyp_description,
        Wtyp_movement_limit: walletType.Wtyp_movement_limit,
        Wtyp_month_limit: walletType.Wtyp_month_limit
    }}).catch(errHandler);

    const enterprise_arr = await Enterprise.findOrCreate({ where: {
        Ent_NIT: enterprise.Ent_NIT,
        Ent_name: enterprise.Ent_name,
        Ent_budget: enterprise.Ent_budget,
        Ent_username: enterprise.Ent_username,
        Ent_password: enterprise.Ent_password
    }}).catch(errHandler);

    const wallet_arr = await Wallet.findOrCreate({ where: {
        Wal_id: wallet.Wal_id,
        Usr_id: wallet.Usr_id,
        Wtyp_id: wallet.Wtyp_id,
        Ent_NIT: wallet.Ent_NIT,
        Wal_balance: wallet.Wal_balance,
        Wal_state: wallet.Wal_state
    }}).catch(errHandler);

    const bank_arr = await Bank.findOrCreate({ where: {
        Bank_name: bank.Bank_name,
        Bank_description: bank.Bank_description,
        Bank_is_authorized: bank.Bank_is_authorized,
        Bank_month_limit: bank.Bank_month_limit,
        Bank_transfer_limit: bank.Bank_transfer_limit
    }}).catch(errHandler);

    const transfer_arr = await Transfer.findOrCreate({ where: {
        Tra_id: transfer.Tra_id,
        Bank_name: transfer.Bank_name,
        Tra_name: transfer.Tra_name,
        Tra_description: transfer.Tra_description,
        Tra_interest_rate: transfer.Tra_interest_rate
    }}).catch(errHandler);

    const movement_arr = await Movement.findOrCreate({ where: {
        Tra_id: movement.Tra_id,
        Wal_id: movement.Wal_id,
        Mov_sender: movement.Mov_sender,
        Mov_recipient: movement.Mov_recipient,
        Mov_total_amount: movement.Mov_total_amount,
        Mov_date: movement.Mov_date,
        Mov_time: movement.Mov_time,
        Mov_is_successful: movement.Mov_is_successful,
        Mov_timestamp: movement.Mov_timestamp
    }}).catch(errHandler);

    //Consulting data
    const query = await User.findAll({
        where: {
            Usr_username: "miapenahu"
        },
        include: [
            {
                model: Wallet,
                as: "possess"
            }
        ]
    }).catch(errHandler);

    console.log("Mi pana Miguel tiene la wallet: ", JSON.stringify(query));
};

