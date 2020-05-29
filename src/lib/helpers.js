const bcrypt = require('bcrypt');

const helpers = {};

helpers.encryptPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (e) {
        console.log(e);
    }
};

helpers.matchPassword = async (password, savedPassword) => {
    //await bcrypt.compare(password, savedPassword);
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch (e) {
        console.log(e);
    }
};

helpers.isWalletState = (state) => {
    if (state == "Active" || state == "Inactive") {
        return state;
    } else {
        return null;
    }
}

helpers.hasNoSpaces = (str) => {
    if (str.indexOf(' ') >= 0) {
        //contains spaces
        return null;
    }
    return str;
}

module.exports = helpers;