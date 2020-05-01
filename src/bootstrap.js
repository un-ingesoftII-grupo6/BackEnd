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


    const errHandler = err => {
        console.log("Error: ", err);
    };


    const user = await User.create({
        Usr_id: 12345,
        Usr_name: "Miguel",
        Usr_surname: "Peña",
        Usr_email: "miapenahu@unal.edu.co",
        Usr_username: "miapenahu",
        Usr_password: 12345
    }).catch(errHandler);

    const walletType = await WalletType.create({
        Wtyp_id: 1,
        Wtyp_name: "Personal",
        Wtyp_description: "This is a personal wallet",
        Wtyp_movement_limit: 4000000.00,
        Wtyp_month_limit: 2000000.00
    }).catch(errHandler);

    const enterprise = await Enterprise.create({
        Ent_NIT: "enterprise-1",
        Ent_name: "Empresa 1",
        Ent_budget: 100000000.00,
        Ent_username: "enterprise1",
        Ent_password: "enterprise1"
    }).catch(errHandler);

    const wallet = await Wallet.create({
        Wal_id: "abcd1234",
        Usr_id: user.Usr_id,
        Wtyp_id: walletType.Wtyp_id,
        Ent_NIT: enterprise.Ent_NIT,
        Wal_balance: 500000.00,
        Wal_state: "Active"
    }).catch(errHandler);

    const bank = await Bank.create({
        Bank_name: "Bancolombia",
        Bank_description: "Banco colombiano",
        Bank_is_authorized: 1,
        Bank_month_limit: 5000000.00,
        Bank_transfer_limit: 10000000.00
    }).catch(errHandler);

    const transfer = await Transfer.create({
        Tra_id: 1,
        Bank_name: bank.Bank_name,
        Tra_name: "Envío dinero",
        Tra_description: "Envío de dinero entre dos personas normales",
        Tra_interest_rate: 2
    }).catch(errHandler);

    const movement = await Movement.create({
        Tra_id: transfer.Tra_id,
        Wal_id: wallet.Wal_id,
        Mov_sender: 12345,
        Mov_recipient: 54321,
        Mov_total_amount: 50000.00,
        Mov_date: "2002-04-27",
        Mov_time: "20:00",
        Mov_is_successful: 1,
        Mov_timestamp: null
    }).catch(errHandler);

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

