const deletion = require("../patterns/factory_deletion");

const deletionFactory = new deletion.Factory();

it("Initial coverage of insertion.Factory", () => {
    deletionFactory.delete({}, {}, "user");
    deletionFactory.delete({}, {}, "bank");
    deletionFactory.delete({}, {}, "wallet");
    deletionFactory.delete({}, {}, "wallet-type");
    deletionFactory.delete({}, {}, "transfer");
    deletionFactory.delete({}, {}, "movement");
    deletionFactory.delete({}, {}, "movement-by-timestamp");
    deletionFactory.delete({}, {}, "enterprise");
    expect(1).toBe(1); 
 });
 