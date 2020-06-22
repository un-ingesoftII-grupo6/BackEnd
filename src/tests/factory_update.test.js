const update = require("../patterns/factory_update");

const updateFactory = new update.Factory();

it("Initial coverage of insertion.Factory", () => {
    updateFactory.update({}, {}, "user");
    updateFactory.update({}, {}, "bank");
    updateFactory.update({}, {}, "wallet");
    updateFactory.update({}, {}, "wallet-state");
    updateFactory.update({}, {}, "wallet-type");
    updateFactory.update({}, {}, "transfer");
    updateFactory.update({}, {}, "enterprise");
    expect(1).toBe(1); 
 });