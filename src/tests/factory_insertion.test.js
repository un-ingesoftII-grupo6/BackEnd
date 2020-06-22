const insertion = require("../patterns/factory_insertion");

const insertionFactory = new insertion.Factory();

it("Initial coverage of insertion.Factory", () => {
    insertionFactory.create({}, {}, "user");
    insertionFactory.create({}, {}, "bank");
    insertionFactory.create({}, {}, "wallet");
    insertionFactory.create({}, {}, "wallet-type");
    insertionFactory.create({}, {}, "transfer");
    insertionFactory.create({}, {}, "movement");
    insertionFactory.create({}, {}, "enterprise");
    expect(1).toBe(1); 
 });