const insertion = require("./factory_insertion");
const selection = require("./factory_selection");
const deletion = require("./factory_deletion");
const update = require("./factory_update");
const logger = require('../logger/logger');
const helpers = require("../lib/helpers");

const insertionFactory = new insertion.Factory();
const selectionFactory = new selection.Factory();
const deletionFactory = new deletion.Factory();
const updateFactory = new update.Factory();

function Factory() {
    this.create = (req, res, entity, crud) => {
        logger.info(crud +  " " + entity +":");
        switch (crud) {
            case "create":
                insertionFactory.create(req, res, entity);
                break;
            case "read":
                selectionFactory.read(req, res, entity);
                break;
            case "update":
                updateFactory.update(req, res, entity);
                break;
            case "delete":
                deletionFactory.delete(req, res, entity);
                break;
            default:
                helpers.loggerWarnAndResponse(404,res,"Unknown route"); return res;
        }
    }
}

module.exports = {
    Factory
}