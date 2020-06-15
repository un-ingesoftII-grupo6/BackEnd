const bcrypt = require('bcrypt');
const logger = require("../logger/logger");
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

helpers.loggerInfoAndResponse = (status, res, message) => {
    try {
        logger.info(message);
        if(status < 400){
        return res.status(status).send(message)
        }
    } catch (e) {
        logger.critical(e.message);
        console.log(e.message);
    }
}

helpers.loggerWarnAndResponse = (status, res, message) => {
    try {
        logger.warning(message);
        return res.status(status).send(message)
    } catch (e) {
        logger.critical(e.message);
        console.log(e.message);
    }
}

helpers.loggerErrorAndResponse = (res, message) => {
    try {
        logger.error(message);
        return res.status(500).send("Error: " + message);
    } catch (e) {
        logger.critical(e.message);
        console.log(e.message);
    }
}

module.exports = helpers;