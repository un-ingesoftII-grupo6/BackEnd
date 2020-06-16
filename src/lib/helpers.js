const bcrypt = require('bcrypt');
const logger = require("../logger/logger");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const helpers = {};
const keys = require('../../config/keys');

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
        if (status < 400) {
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

const key = keys.tokenKey;

helpers.generateToken = (ttl) =>{
    const payload = { }; //Here would the user/enterprise role info saved, to retrieve later in other functions for authorization
    return jwt.sign(payload,key,{ expiresIn: ttl });
}

helpers.beginTokenValidation = (req, res, next) => {
    const token = req.headers['access-token'];

    if (token) {
        jwt.verify(token, key, (err, decoded) => {
            if (err) {
                logger.warning('Invalid token');
                return res.json({ message: 'Invalid token' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        logger.warning('Token doesn\'t provided');
        res.send({
            message: 'Token doesn\'t provided'
        });
    }
}

module.exports = helpers;