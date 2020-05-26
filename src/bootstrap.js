const helpers = require("./lib/helpers");
const uuid = require('uuid');

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

