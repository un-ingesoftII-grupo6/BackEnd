const update = require("../patterns/factory_update");
const app = require('../index');
const supertest = require('supertest');
const request = supertest(app);

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

describe("Update User data", () => {
    it("Should update user with given data correctly", async (done) => {
        await request.put("/user/edit/nicrodriguezval")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "name": "Nicolas",
                "surname": "Rodriguez(Updated)",
                "new_password": "123123",
                "old_password": "123123"
            })
            .expect('Content-Type', /json/)
            .expect((res) => {
                const { Usr_id, Usr_username, Usr_name, Usr_surname } = res.body.user;
                delete res.body.user;
                Object.assign(res.body, {
                    user: {
                        Usr_id: Usr_id,
                        Usr_username: Usr_username,
                        Usr_name: Usr_name,
                        Usr_surname: Usr_surname
                    }
                });
            })
            .expect(200, {
                user: {
                    Usr_id: 2,
                    Usr_username: "nicrodriguezval",
                    Usr_name: "Nicolas",
                    Usr_surname: "Rodriguez(Updated)"
                }
            });
        done()
    });
    it("Should update only one of the parameters correctly", async (done) => {
        await request.put("/user/edit/nicrodriguezval")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "surname": "Rodriguez(Updt.2)", //Is the same as old_password for forward testing purposes
                "old_password": "123123"
            })
            .expect('Content-Type', /json/)
            .expect((res) => {
                const { Usr_id, Usr_username, Usr_name, Usr_surname } = res.body.user;
                delete res.body.user;
                Object.assign(res.body, {
                    user: {
                        Usr_id: Usr_id,
                        Usr_username: Usr_username,
                        Usr_name: Usr_name,
                        Usr_surname: Usr_surname
                    }
                });
            })
            .expect(200, {
                user: {
                    Usr_id: 2,
                    Usr_username: "nicrodriguezval",
                    Usr_name: "Nicolas",
                    Usr_surname: "Rodriguez(Updt.2)"
                }
            });
            //.expect(500,"Hola");
        done()
    });
    it("Should return 401 as previous password does not coincide with the stored one", async (done) => {
        await request.put("/user/edit/miapenahu")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "name": "Miguel",
                "surname": "Rojas",
                "password": "Abcd1234",
                "old_password": "not-the-old-password" //This is no the stored password
            })
            .expect('Content-Type', /text/)
            .expect(401, "Password is incorrect. Please try again");
        done()
    });
});

describe("Update Bank data", () => {
    it("Should update bank with given data correctly", async (done) => {
        await request.put("/bank/edit/1")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "description": "Banco Colombiano",
                "is_authorized": 0,
                "month_limit": 4000000,
                "trasfer_limit": 8000000
            })
            .expect('Content-Type', /json/)
            .expect((res) => {
                const { Bank_name, Bank_description, Bank_is_authorized } = res.body.bank;
                delete res.body.bank;
                Object.assign(res.body, {
                    bank: {
                        Bank_name: Bank_name,
                        Bank_description: Bank_description,
                        Bank_is_authorized: Bank_is_authorized
                    }
                });
            })
            .expect(200, {
                bank: {
                    Bank_name: "Bancolombia",
                    Bank_description: "Banco Colombiano",
                    Bank_is_authorized: 0
                }
            });
        done()
    });
    it("Should return 404 as Bank_id does belongs to no bank", async (done) => {
        await request.put("/bank/edit/1000") //This Bank_id does not belong to a bank
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "description": "Banco Colombiano",
                "is_authorized": 0,
                "month_limit": 4000000,
                "trasfer_limit": 8000000
            })
            .expect('Content-Type', /text/)
            .expect(404, "Bank not found");
        done()
    });
    it("Should return 400 if the update data is the same", async (done) => {
        await request.put("/bank/edit/1")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "description": "Banco Colombiano",
                "is_authorized": 0,
                "month_limit": 4000000,
                "trasfer_limit": 8000000
            })
            .expect('Content-Type', /text/)
            .expect(400, "Not updated: Update data is the same");
        done()
    });
});

describe("Update Wallet data", () => {
    it("Should update wallet with given data correctly", async (done) => {
        await request.put("/wallet/edit/bce63b35-031b-43a3-988d-bd6600a0b5af")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "wallettype": 1,
                "balance": 5000000,
                "state": "Active",
                "ent_id": null
            })
            .expect('Content-Type', /json/)
            .expect((res) => {
                const { Wtyp_id, Wal_balance, Wal_state } = res.body.wallet;
                delete res.body.wallet;
                Object.assign(res.body, {
                    wallet: {
                        Wtyp_id: Wtyp_id,
                        Wal_balance: Wal_balance,
                        Wal_state: Wal_state
                    }
                });
            })
            .expect(200, {
                wallet: {
                    Wtyp_id: 1,
                    Wal_balance: 5000000,
                    Wal_state: "Active"
                }
            });
        done()
    });
    it("Should return status 400 as new state is not a valid Wallet State", async (done) => {
        await request.put("/wallet/edit/bce63b35-031b-43a3-988d-bd6600a0b5af")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "wallettype": 1,
                "balance": 5000000,
                "state": "not-a-valid-wallet-state",
                "ent_id": null
            })
            .expect('Content-Type', /text/)
            .expect(400, 'Not a valid wallet state (Active, Inactive)');
        done()
    });
    it("Should return status 400 as new wallet type is not a valid Wallet Type", async (done) => {
        await request.put("/wallet/edit/bce63b35-031b-43a3-988d-bd6600a0b5af")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "wallettype": 1000, //Not a valid Wallet Type
                "balance": 5000000,
                "state": "Active",
                "ent_id": null
            })
            .expect('Content-Type', /text/)
            .expect(400, 'Not a valid wallet type');
        done()
    });
    it("Should return 404 if the Wal_id does not match any wallet", async (done) => {
        await request.put("/wallet/edit/not-a-valid-wallet") // This is not a valid wallet
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "wallettype": 1,
                "balance": 5000000,
                "state": "Active",
                "ent_id": null
            })
            .expect('Content-Type', /text/)
            .expect(404, "Wallet not found");
        done()
    });
    it("Should return 400 if the update data is the same", async (done) => {
        await request.put("/wallet/edit/48502bcf-87bb-4f88-a7f7-4a5978debb22")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "wallettype": 3,
                "balance": 0,
                "state": "Active",
                "ent_id": 1
            })
            .expect('Content-Type', /text/)
            .expect(400, "Not updated: Update data is the same");
        done()
    });
});

describe("Update Wallet Limits and State data", () => {
    it("Should update wallet with Wtyp_id 1 with given data correctly", async (done) => {
        await request.put("/wallet/edit/miapenahu/bce63b35-031b-43a3-988d-bd6600a0b5af")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "password": "Abcd1234",
                "state": "Inactive",
            })
            .expect('Content-Type', /json/)
            .expect((res) => {
                const { Wtyp_id, Wal_state, Wal_movement_limit, Wal_month_limit } = res.body.wallet;
                delete res.body.wallet;
                Object.assign(res.body, {
                    wallet: {
                        Wtyp_id: Wtyp_id,
                        Wal_state: Wal_state,
                        Wal_month_limit: Wal_month_limit,
                        Wal_movement_limit: Wal_movement_limit
                    }
                });
            })
            .expect(200, {
                wallet: {
                    Wtyp_id: 1,
                    Wal_state: "Inactive",
                    Wal_month_limit: 2000000,
                    Wal_movement_limit: 4000000
                }
            });
        done()
    });

    it("Should update wallet with Wtyp_id 3 given data correctly", async (done) => {
        await request.put("/wallet/edit/miapenahu-enterprise1/48502bcf-87bb-4f88-a7f7-4a5978debb22")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "password": "empresa1",
                "state": "Active",
                "new_movement_limit": 8700000,
                "new_month_limit": 4500000
            })
            .expect('Content-Type', /json/)
            .expect((res) => {
                const { Wtyp_id, Wal_state, Wal_movement_limit, Wal_month_limit } = res.body.wallet;
                delete res.body.wallet;
                Object.assign(res.body, {
                    wallet: {
                        Wtyp_id: Wtyp_id,
                        Wal_state: Wal_state,
                        Wal_month_limit: Wal_month_limit,
                        Wal_movement_limit: Wal_movement_limit
                    }
                });
            })
            .expect(200, {
                wallet: {
                    Wtyp_id: 3,
                    Wal_state: "Active",
                    Wal_month_limit: 4500000,
                    Wal_movement_limit: 8700000
                }
            });

        done()
    });
    it("Should return status 400 as Wallet State is null", async (done) => {
        await request.put("/wallet/edit/miapenahu-enterprise1/48502bcf-87bb-4f88-a7f7-4a5978debb22")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "password": "empresa1",
                "state": null, //Or just could be ignored in the request
                "new_movement_limit": 8700000,
                "new_month_limit": 4500000
            })
            .expect('Content-Type', /text/)
            .expect(400, "Not a valid wallet state (Active, Inactive)");
        done()
    });
    it("Should return status 401 if the password is incorrect", async (done) => {
        await request.put("/wallet/edit/miapenahu-enterprise1/48502bcf-87bb-4f88-a7f7-4a5978debb22")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "password": "fake-password", //The password is incorrect
                "state": "Active",
                "new_movement_limit": 8700000,
                "new_month_limit": 4500000
            })
            .expect('Content-Type', /text/)
            .expect(401, "The password is incorrect. Please try again");
        done()
    });
    it("Should return status 404 of the password is incorrect", async (done) => {
        await request.put("/wallet/edit/miapenahu-enterprise1/bce63b35-031b-43a3-988d-bd6600a0b5af") //This wallet doesn't belong to this user
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "password": "empresa1",
                "state": "Active",
                "new_movement_limit": 8700000,
                "new_month_limit": 4500000
            })
            .expect('Content-Type', /text/)
            .expect(401, "The User does not own this wallet");
        done()
    });
    it("Should return 500 if the username does not exist", async (done) => {
        await request.put("/wallet/edit/fake-username/48502bcf-87bb-4f88-a7f7-4a5978debb22") //The username here does not exist 
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "password": "empresa1",
                "state": "Active",
                "new_movement_limit": 8700000,
                "new_month_limit": 4500000
            })
            .expect('Content-Type', /text/)
            .expect(500, "Error: Cannot read property 'Usr_id' of null");
        done()
    });
});

describe("Update Transfer data", () => {
    it("Should update transfer with given data correctly", async (done) => {
        await request.put("/transfer/edit/1")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "name": "Send money",
                "description": "Updated description",
                "interest": 10
            })
            .expect('Content-Type', /json/)
            .expect((res) => {
                const { Tra_name, Tra_interest_rate } = res.body.transfer;
                delete res.body.transfer;
                Object.assign(res.body,{
                    transfer: {
                        Tra_name: Tra_name,
                        Tra_interest_rate: Tra_interest_rate
                    }
                });
            })
            .expect(200,{
                transfer: {
                    Tra_name: "Send money",
                    Tra_interest_rate: 10
                }
            });
        done()
    });
});

describe("Update Enterprise data", () => {
    it("Should update enterprise with given data correctly", async (done) => {
        await request.put("/enterprise/edit/enterprise2")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "name": "Empresa 2(Updated)",
                "description": "Mejor eslogan",
                "budget": 45000000.00,
                "new_password": "empresa2", 
                "old_password": "empresa2"
            })
            .expect('Content-Type', /json/)
            .expect((res) => {
                const { Ent_id, Ent_name, Ent_budget } = res.body.enterprise;
                delete res.body.enterprise;
                Object.assign(res.body, {
                    enterprise: {
                        Ent_id: Ent_id,
                        Ent_name: Ent_name,
                        Ent_budget: Ent_budget
                    }
                });
            })
            .expect(200, {
                enterprise: {
                    Ent_id: 2,
                    Ent_name: "Empresa 2(Updated)",
                    Ent_budget: 45000000.00
                }
            });
            //.expect(500, "Hola");
        done()
    });
    it("Should update only one parameter from enterprise correctly", async (done) => {
        await request.put("/enterprise/edit/enterprise2")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "name": "Empresa 2(Upd.2)",
                "old_password": "empresa2"
            })
            .expect('Content-Type', /json/)
            .expect((res) => {
                const { Ent_id, Ent_name, Ent_budget } = res.body.enterprise;
                delete res.body.enterprise;
                Object.assign(res.body, {
                    enterprise: {
                        Ent_id: Ent_id,
                        Ent_name: Ent_name,
                        Ent_budget: Ent_budget
                    }
                });
            })
            .expect(200, {
                enterprise: {
                    Ent_id: 2,
                    Ent_name: "Empresa 2(Upd.2)",
                    Ent_budget: 45000000.00
                }
            });
            //.expect(500, "Hola");
        done()
    });
    it("Should return 400 status if enterprise data is the same", async (done) => {
        await request.put("/enterprise/edit/enterprise1") 
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "old_password": "empresa1"
            })
            .expect('Content-Type', /text/)
            .expect(400,"Not updated: Update data is the same");
            //.expect(500, "Hola");
        done()
    });
    it("Should return 401 status if password is incorrect", async (done) => {
        await request.put("/enterprise/edit/enterprise2") 
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "name": "Empresa 2(Upd.2)",
                "old_password": "not-correct-password" //This is not the correct password
            })
            .expect('Content-Type', /text/)
            .expect(401,"The password is incorrect. Please try again");
            //.expect(500, "Hola");
        done()
    });
    it("Should return 404 status if enterprise was not found", async (done) => {
        await request.put("/enterprise/edit/enterprise-not-existant") //This enterprise does not exist
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "name": "Empresa 2(Upd.2)",
                "old_password": "empresa2"
            })
            .expect('Content-Type', /text/)
            .expect(404,"Enterprise not found");
            //.expect(500, "Hola");
        done()
    });
});