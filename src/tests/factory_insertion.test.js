const insertion = require("../patterns/factory_insertion");
const app = require('../index');
const supertest = require('supertest');
const request = supertest(app);

const insertionFactory = new insertion.Factory();

it("Initial coverage of insertion.Factory", () => {
    //insertionFactory.create({}, {}, "user");
    //insertionFactory.create({}, {}, "bank");
    //insertionFactory.create({}, {}, "wallet");
    //insertionFactory.create({}, {}, "wallet-type");
    //insertionFactory.create({}, {}, "transfer");
    //insertionFactory.create({}, {}, "movement");
    insertionFactory.create({}, {}, "enterprise");
    expect(1).toBe(1);
});

describe("Register new User", () => {
    it("Should register user with wallet type personal correctly", async (done) => {
        await request.post("/user/signup")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "name": "Mario",
                "surname": "Bros",
                "email": "abcd@abcd.com",
                "username": "mario-bros",
                "password": "its_a_me",
                "cpassword": "its_a_me",
                "wtyp_id": 1,
                "ent_id": null  //This element is only necesary if wtyp-id is 3 (Managed) 
            })
            .expect('Content-Type', /json/)
            .expect((res) => {
                const { Usr_id, Usr_username, Usr_name } = res.body.user;
                const { Wtyp_id, Ent_id, Wal_balance } = res.body.wallet;
                delete res.body.user;
                Object.assign(res.body, {
                    user: {
                        Usr_id: Usr_id,
                        Usr_username: Usr_username,
                        Usr_name: Usr_name
                    },
                    wallet: {
                        Wtyp_id: Wtyp_id,
                        Ent_id: Ent_id,
                        Wal_balance: Wal_balance
                    }
                });
            })
            .expect(201, {
                user: {
                    Usr_id: 5,
                    Usr_username: "mario-bros",
                    Usr_name: "Mario"
                },
                wallet: {
                    Wtyp_id: 1,
                    Ent_id: null,
                    Wal_balance: 0
                }
            });
        done()
    });
    it("Should register user with wallet type managed correctly", async (done) => {
        await request.post("/user/signup")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "name": "Bob",
                "surname": "Marley",
                "email": "example@abcd.com",
                "username": "bob-marley",
                "password": "marley-bob",
                "cpassword": "marley-bob",
                "wtyp_id": 3,
                "ent_id": 1  //This element is only necesary if wtyp-id is 3 (Managed) 
            })
            .expect('Content-Type', /json/)
            .expect((res) => {
                const { Usr_id, Usr_username, Usr_name } = res.body.user;
                const { Wtyp_id, Ent_id, Wal_balance } = res.body.wallet;
                delete res.body.user;
                Object.assign(res.body, {
                    user: {
                        Usr_id: Usr_id,
                        Usr_username: Usr_username,
                        Usr_name: Usr_name
                    },
                    wallet: {
                        Wtyp_id: Wtyp_id,
                        Ent_id: Ent_id,
                        Wal_balance: Wal_balance
                    }
                });
            })
            .expect(201, {
                user: {
                    Usr_id: 6,
                    Usr_username: "bob-marley",
                    Usr_name: "Bob"
                },
                wallet: {
                    Wtyp_id: 3,
                    Ent_id: 1,
                    Wal_balance: 0
                }
            });
        done()
    });
    it("Should return 404 status as enterprise was not found", async (done) => {
        await request.post("/user/signup")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "name": "Cliff",
                "surname": "Hanger",
                "email": "changerr@abcd.com",
                "username": "cliff-hanger",
                "password": "password",
                "cpassword": "password",
                "wtyp_id": 3,
                "ent_id": 100 //This enterprise doesn't exist
            })
            .expect('Content-Type', /text/)
            .expect(404, "Specified enterprise not found. Please try again");
        done()
    });
    it("Should return 400 status as passwords inserted doesn't coincide", async (done) => {
        await request.post("/user/signup")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "name": "Mike",
                "surname": "Miller",
                "email": "mikemiller@abcd.com",
                "username": "mike-miller",
                "password": "password",
                "cpassword": "different-password",
                "wtyp_id": 3,
                "ent_id": 1  //This element is only necesary if wtyp-id is 3 (Managed) 
            })
            .expect('Content-Type', /text/)
            .expect(400, "Passwords inserted does not coincide");
        done()
    });
    it("Should return 404 status as wallet type doesn't exist", async (done) => {
        await request.post("/user/signup")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "name": "Otto",
                "surname": "Matic",
                "email": "ottomatic@abcd.com",
                "username": "otto-matic",
                "password": "password",
                "cpassword": "password",
                "wtyp_id": 100, //This wallet type does not exist
                "ent_id": 1
            })
            .expect('Content-Type', /text/)
            .expect(404, "Specified wallet type does not exists");
        done()
    });
    it("Should return 400 status as username contains spaces", async (done) => {
        await request.post("/user/signup")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "name": "Otto",
                "surname": "Matic",
                "email": "ottomatic@abcd.com",
                "username": "otto matic",
                "password": "password",
                "cpassword": "password",
                "wtyp_id": 3, //This wallet type does not exist
                "ent_id": 1
            })
            .expect('Content-Type', /text/)
            .expect(400, "Username can't contain spaces");
        done()
    });
    it("Should return 400 status as username is already registered", async (done) => {
        await request.post("/user/signup")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "name": "Bob",
                "surname": "Marley",
                "email": "example@abcd.com",
                "username": "bob-marley",
                "password": "marley-bob",
                "cpassword": "marley-bob",
                "wtyp_id": 3,
                "ent_id": 1
            })
            .expect('Content-Type', /text/)
            .expect(400, "Username is already registered");
        done()
    });
    it("Should return 500 error for missing arguments", async (done) => {
        await request.post("/user/signup")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                //"name": "Bob",
                "surname": "Marley",
                "email": "example@abcd.com",
                //"username": "bob-marley",
                //"password": "marley-bob",
                "cpassword": "marley-bob",
                "wtyp_id": 3,
                "ent_id": 1
            })
            .expect('Content-Type', /text/)
            .expect(500, "Error: Cannot read property 'indexOf' of undefined");
        done()
    });
});

describe("Insert New Bank", () => {
    it("Should insert mew bank correctly", async (done) => {
        await request.post("/bank/create")
        .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
        .send({
            "name": "Davivienda",
            "description": "Otro banco Colombiano",
            "is_authorized" : 1,
            "month_limit": 6000000.00,
            "transfer_limit": 3000000.00  
        })
        .expect('Content-Type', /json/)
        .expect((res) => {
            const { Bank_name, Bank_month_limit, Bank_transfer_limit } = res.body.bank;
            delete res.body.bank;
            Object.assign(res.body, {
                bank: {
                    Bank_name: Bank_name,
                    Bank_month_limit: Bank_month_limit,
                    Bank_transfer_limit: Bank_transfer_limit
                }
            });
        })
        .expect(201, {
            bank: {
                Bank_name: "Davivienda",
                Bank_month_limit: 6000000.00,
                Bank_transfer_limit: 3000000.00  
            }
        });
        done()
    });
    it("Should return 500 error for missing arguments", async (done) => {
        await request.post("/bank/create")
        .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
        .send({
            //"name": "Davivienda",
            "description": "Otro banco Colombiano",
            "is_authorized" : 1,
            "month_limit": 6000000.00,
            "transfer_limit": 3000000.00  
        })
        .expect('Content-Type', /text/)
        .expect(500,"Error: notNull Violation: Bank.Bank_name cannot be null");
        done()
    });
});

describe("Insert New Wallet", () => {
    it("Should insert new wallet Personal correctly", async (done) => {
        await request.post("/wallet/create/bob-marley")
        .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
        .send({
            "password": "marley-bob",
            "wallettype": 1
        })
        .expect('Content-Type', /json/)
        .expect((res) => {
            const { Usr_id, Ent_id, Wal_state } = res.body.wallet;
            delete res.body.wallet;
            Object.assign(res.body, {
                wallet: {
                    Usr_id: Usr_id,
                    Ent_id: Ent_id,
                    Wal_state: Wal_state
                }
            });
        })
        .expect(201,{
            wallet: {
                Usr_id: 6,
                Ent_id: null,
                Wal_state: "Active" 
            }
        });
        done()
    });
    it("Should insert new wallet  correctly", async (done) => {
        await request.post("/wallet/create/bob-marley")
        .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
        .send({
            "password": "marley-bob",
            "wallettype": 3,
            "ent_id": 1
        })
        .expect('Content-Type', /json/)
        .expect((res) => {
            const { Usr_id, Ent_id, Wal_state } = res.body.wallet;
            delete res.body.wallet;
            Object.assign(res.body, {
                wallet: {
                    Usr_id: Usr_id,
                    Ent_id: Ent_id,
                    Wal_state: Wal_state
                }
            });
        })
        .expect(201, {
            wallet: {
                Usr_id: 6,
                Ent_id: 1,
                Wal_state: "Active" 
            }
        });
        done()
    });
    it("Should return 404 status as ent_id does not exist", async (done) => {
        await request.post("/wallet/create/bob-marley")
        .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
        .send({
            "password": "marley-bob",
            "wallettype": 3,
            "ent_id": 100 //This Enterprise id doesn't exist
        })
        .expect('Content-Type', /text/)
        .expect(404,"Specified enterprise not found. Please try again");
        done()
    });
    it("Should return 401 status as password is incorrect", async (done) => {
        await request.post("/wallet/create/bob-marley")
        .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
        .send({
            "password": "wrong-password",
            "wallettype": 3,
            "ent_id": 1 
        })
        .expect('Content-Type', /text/)
        .expect(401,"The password is incorrect. Please try again");
        done()
    });
    it("Should return 404 status as wallet type does not exist", async (done) => {
        await request.post("/wallet/create/bob-marley")
        .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
        .send({
            "password": "marley-bob",
            "wallettype": 100,  //This wallet type doesn't exist
            "ent_id": 1 
        })
        .expect('Content-Type', /text/)
        .expect(404,"Specified wallet type does not exists");
        done()
    });
    it("Should return 404 status as user with specified username does not exist", async (done) => {
        await request.post("/wallet/create/unknown-username")
        .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
        .send({
            "password": "marley-bob",
            "wallettype": 3,  
            "ent_id": 1 
        })
        .expect('Content-Type', /text/)
        .expect(404,"User with specified username does not exists");
        done()
    });
    it("Should return 500 for missing arguments", async (done) => {
        await request.post("/wallet/create/bob-marley")
        .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
        .send({
            "password": "marley-bob",
            "wallettype": 3,  
            //"ent_id": 1 
        })
        .expect('Content-Type', /text/)
        .expect(500,'Error: WHERE parameter "Ent_id" has invalid "undefined" value');
        done()
    });
});

describe("Insert New Wallet Type", () => {
    it("Should insert new wallet type correctly", async (done) => {
        await request.post("/wallet-type/create")
        .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
        .send({
            "name": "Admin",
            "description": "La wallet con control total del sistema",
            "movement_limit": 50000000,
            "month_limit": 10000000
        })
        .expect('Content-Type', /json/)
        .expect((res) => {
            const { Wtyp_id, Wtyp_name } = res.body.wallet_type;
            delete res.body.wallet_type;
            Object.assign(res.body, {
                wallet_type: {
                    Wtyp_id: Wtyp_id,
                    Wtyp_name: Wtyp_name
                }
            });
        })
        .expect(201, {
            wallet_type: {
                Wtyp_id: 5,
                Wtyp_name: "Admin"
            }
        });
        done()
    });
    it("Should return 400 status as Wallet Type name contains spaces", async (done) => {
        await request.post("/wallet-type/create")
        .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
        .send({
            "name": "Admin has spaces",
            "description": "La wallet con control total del sistema",
            "movement_limit": 50000000,
            "month_limit": 10000000
        })
        .expect('Content-Type', /text/)
        .expect(400, "Wallet Type name can't contain spaces");
        done()
    });
    it("Should return 500 for missing arguments", async (done) => {
        await request.post("/wallet-type/create")
        .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
        .send({
            //"name": "Admin has spaces",
            "description": "La wallet con control total del sistema",
            "movement_limit": 50000000,
            "month_limit": 10000000
        })
        .expect('Content-Type', /text/)
        .expect(500, "Error: Cannot read property 'indexOf' of undefined");
        done()
    });
});

describe("Insert New Transfer", () => {
    it("Should insert new Transfer correctly", async (done) => {
        await request.post("/transfer/create")
        .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
        .send({
            "bank_id": null,
            "name": "Enviar dinero a mi abuela",
            "route": "enviar-abuela",
            "description": "Es como enviar dinero, pero siempre a la misma persona",
            "interest": 0
        })
        .expect('Content-Type', /json/)
        .expect((res) => {
            const { Tra_name, Tra_route } = res.body.transfer;
            delete res.body.transfer;
            Object.assign(res.body, {
                transfer: {
                    Tra_name: Tra_name,
                    Tra_route: Tra_route
                }
            });
        })
        .expect(201, {
            transfer: {
                Tra_name: "Enviar dinero a mi abuela",
                Tra_route: "enviar-abuela"
            }
        });
        done()
    });
    it("Should return 400 status as Wallet Type name contains spaces", async (done) => {
        await request.post("/transfer/create")
        .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
        .send({
            "bank_id": null,
            "name": "Enviar dinero a mi abuela",
            "route": "enviar abuela",
            "description": "Es como enviar dinero, pero siempre a la misma persona",
            "interest": 0
        })
        .expect('Content-Type', /text/)
        .expect(400, "Transfer Route can't contain spaces");
        done()
    });
    it("Should return 500 for missing arguments", async (done) => {
        await request.post("/transfer/create")
        .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
        .send({
            "bank_id": null,
            "name": "Enviar dinero a mi abuela",
            //"route": "enviar abuela",
            "description": "Es como enviar dinero, pero siempre a la misma persona",
            "interest": 0
        })
        .expect('Content-Type', /text/)
        .expect(500, "Error: Cannot read property 'indexOf' of undefined");
        done()
    });
});

describe("Insert New Movement", () => {
    it("Should send money from user to user correctly", async (done) => {
        await request.post("/movement/send-money")
        .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
        .send({
            "wal_id_sender": "bce63b35-031b-43a3-988d-bd6600a0b5af", //Personal Wallet user 1
            "wal_id_recipient": "58ecb6c2-c137-418b-9b2f-01425ac7b124", //Personal Wallet user 2
            "amount": 10000.00,
            "password": "Abcd1234"
        })
        .expect('Content-Type', /json/)
        .expect((res) => {
            const { Mov_total_amount, Mov_is_successful } = res.body.movement;
            delete res.body.movement;
            Object.assign(res.body, {
                movement: {
                    Mov_total_amount: Mov_total_amount,
                    Mov_is_successful: Mov_is_successful
                }
            });
        })
        .expect(201, {
            movement: {
                Mov_total_amount: 10000,
                Mov_is_successful: 1
            }
        });
        done()
    });
    it("Should send money from user to enterprise correctly", async (done) => {
        await request.post("/movement/send-money")
        .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
        .send({
            "wal_id_sender": "bce63b35-031b-43a3-988d-bd6600a0b5af", //Personal Wallet Usr_id 1
            "wal_id_recipient": "022f8a82-5d63-408d-bbd3-9b123f86a14c", //Enterprise Wallet Ent_id 1
            "amount": 10000.00,
            "password": "Abcd1234"
        })
        .expect('Content-Type', /json/)
        .expect((res) => {
            const { Mov_total_amount, Mov_is_successful } = res.body.movement;
            delete res.body.movement;
            Object.assign(res.body, {
                movement: {
                    Mov_total_amount: Mov_total_amount,
                    Mov_is_successful: Mov_is_successful
                }
            });
        })
        .expect(201, {
            movement: {
                Mov_total_amount: 10000,
                Mov_is_successful: 1
            }
        });
        done()
    });
    it("Should send money from enterprise to user correctly", async (done) => {
        await request.post("/movement/send-money")
        .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
        .send({
            "wal_id_sender": "022f8a82-5d63-408d-bbd3-9b123f86a14c", //Enterprise Wallet Ent_id 1
            "wal_id_recipient": "bce63b35-031b-43a3-988d-bd6600a0b5af", //Personal Wallet Usr_id 1
            "amount": 10000.00,
            "password": "empresa1"
        })
        .expect('Content-Type', /json/)
        .expect((res) => {
            const { Mov_total_amount, Mov_is_successful } = res.body.movement;
            delete res.body.movement;
            Object.assign(res.body, {
                movement: {
                    Mov_total_amount: Mov_total_amount,
                    Mov_is_successful: Mov_is_successful
                }
            });
        })
        .expect(201, {
            movement: {
                Mov_total_amount: 10000,
                Mov_is_successful: 1
            }
        });
        done()
    });
    it("Should send money from enterprise to enterprise correctly", async (done) => {
        await request.post("/movement/send-money")
        .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
        .send({
            "wal_id_sender": "022f8a82-5d63-408d-bbd3-9b123f86a14c", //Enterprise Wallet Ent_id 1
            "wal_id_recipient": "1a10209b-63e6-42bd-98c9-f33d28a8d318", //Enterprise Wallet Ent_id 2            "amount": 10000.00,
            "amount": 10000.00,
            "password": "empresa1"
        })
        .expect('Content-Type', /json/)
        .expect((res) => {
            const { Mov_total_amount, Mov_is_successful } = res.body.movement;
            delete res.body.movement;
            Object.assign(res.body, {
                movement: {
                    Mov_total_amount: Mov_total_amount,
                    Mov_is_successful: Mov_is_successful
                }
            });
        })
        .expect(201, {
            movement: {
                Mov_total_amount: 10000,
                Mov_is_successful: 1
            }
        });
        done()
    });
    it("Should return 401 as sender wallet has no funds for the movement", async (done) => {
        await request.post("/movement/send-money")
        .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
        .send({
            "wal_id_sender": "58ecb6c2-c137-418b-9b2f-01425ac7b124", //Wallet Usr_id 2 Wal_balance ~500000
            "wal_id_recipient": "1a10209b-63e6-42bd-98c9-f33d28a8d318", //Enterprise Wallet Ent_id 2   
            "amount": 1000000.00,  //Exceeds the wallet funds
            "password": "123123"
        })
        .expect('Content-Type', /text/)
        .expect(401,"The Sender Wallet has no funds for this operation");
        done()
    });
    it("Should return 401 as the password is incorrect", async (done) => {
        await request.post("/movement/send-money")
        .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
        .send({
            "wal_id_sender": "58ecb6c2-c137-418b-9b2f-01425ac7b124", //Wallet Usr_id 2 Wal_balance ~500000
            "wal_id_recipient": "1a10209b-63e6-42bd-98c9-f33d28a8d318", //Enterprise Wallet Ent_id 2   
            "amount": 10000.00,  
            "password": "not-the-correct-password"  //Incorrect password
        })
        .expect('Content-Type', /text/)
        .expect(401,"The password is incorrect. Please try again");
        done()
    });
    it("Should return 404 as the transfer type is incorrect", async (done) => {
        await request.post("/movement/not-valid-transfer-type") //Incorrect transfer type
        .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
        .send({
            "wal_id_sender": "58ecb6c2-c137-418b-9b2f-01425ac7b124", //Wallet Usr_id 2 Wal_balance ~500000
            "wal_id_recipient": "1a10209b-63e6-42bd-98c9-f33d28a8d318", //Enterprise Wallet Ent_id 2   
            "amount": 10000.00,  
            "password": "123123"
        })
        .expect('Content-Type', /text/)
        .expect(404,"Transfer type not found");
        done()
    });
    it("Should return 400 if user sends incomplete amounts ($1001, $599)", async (done) => {
        await request.post("/movement/send-money") 
        .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
        .send({
            "wal_id_sender": "58ecb6c2-c137-418b-9b2f-01425ac7b124", //Wallet Usr_id 2 Wal_balance ~500000
            "wal_id_recipient": "1a10209b-63e6-42bd-98c9-f33d28a8d318", //Enterprise Wallet Ent_id 2   
            "amount": 10257.88,   //Incorrect amount 
            "password": "123123"
        })
        .expect('Content-Type', /text/)
        .expect(400,"The minimum unit of money you can add is $1000");
        done()
    });
    it("Should return 400 if user sends less than $5000", async (done) => {
        await request.post("/movement/send-money")
        .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
        .send({
            "wal_id_sender": "58ecb6c2-c137-418b-9b2f-01425ac7b124", //Wallet Usr_id 2 Wal_balance ~500000
            "wal_id_recipient": "1a10209b-63e6-42bd-98c9-f33d28a8d318", //Enterprise Wallet Ent_id 2   
            "amount": 100.00,   //Incorrect amount 
            "password": "123123"
        })
        .expect('Content-Type', /text/)
        .expect(400,"You can't send less than $5000");
        done()
    });
    it("You can't send money to yourserlf.", async (done) => {
        await request.post("/movement/send-money") 
        .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
        .send({
            "wal_id_sender": "58ecb6c2-c137-418b-9b2f-01425ac7b124", //Wallet Usr_id 2 Wal_balance ~500000
            "wal_id_recipient": "58ecb6c2-c137-418b-9b2f-01425ac7b124", //Wallet Usr_id 2 Wal_balance ~500000  
            "amount": 10000.00,   
            "password": "123123"
        })
        .expect('Content-Type', /text/)
        .expect(400,"You can't send money to yourself!");
        done()
    });
    it("Should return 404 status as Recipient Wallet not found", async (done) => {
        await request.post("/movement/send-money") 
        .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
        .send({
            "wal_id_sender": "58ecb6c2-c137-418b-9b2f-01425ac7b124", //Wallet Usr_id 2 Wal_balance ~500000
            "wal_id_recipient": "12345684749",  //Recipient Wallet does not exist 
            "amount": 10000.00,   
            "password": "123123"
        })
        .expect('Content-Type', /text/)
        .expect(404,"Recipient Wallet not found");
        done()
    });
    it("Should return 404 status as Sender Wallet not found", async (done) => {
        await request.post("/movement/send-money") 
        .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
        .send({
            "wal_id_sender": "123451i24u4", //Sender Wallet does not exist
            "wal_id_recipient": "58ecb6c2-c137-418b-9b2f-01425ac7b124",  //Wallet Usr_id 2 Wal_balance ~500000 
            "amount": 10000.00,   
            "password": "123123"
        })
        .expect('Content-Type', /text/)
        .expect(404,"Sender Wallet not found");
        done()
    });
    it("Should return 500 for missing arguments", async (done) => {
        await request.post("/movement/send-money") 
        .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
        .send({
            //"wal_id_sender": "1a10209b-63e6-42bd-98c9-f33d28a8d318", //Enterprise Wallet Ent_id 2   
            "wal_id_recipient": "58ecb6c2-c137-418b-9b2f-01425ac7b124",  //Wallet Usr_id 2 Wal_balance ~500000 
            "amount": 10000.00,   
            "password": "123123"
        })
        .expect('Content-Type', /text/)
        .expect(500,'Error: WHERE parameter "Wal_id" has invalid "undefined" value');
        done()
    });
});

describe("Insert New Enterprise", () => {
    it("Should insert new Enterprise correctly", async (done) => {
        await request.post("/enterprise/create")
        .send({
            "NIT": "soy-una-empresa",
            "name": "Azúcar Manuelita",
            "description": "Este espacio es patrocinado por azúcar manuelita, que refina el mejor azúcar del país",
            "budget": 800000000.011,
            "username":"manuelita",
            "password": "azucar",
            "month_limit": 6500000,
            "movement_limit": 3900000
        })
        .expect('Content-Type', /json/)
        .expect((res) => {
            const { Ent_name, Ent_username } = res.body.enterprise;
            delete res.body.enterprise;
            delete res.body.wallet;
            Object.assign(res.body, {
                enterprise: {
                    Ent_name: Ent_name,
                    Ent_username: Ent_username
                }
            });
        })
        .expect(201, {
            enterprise: {
                Ent_name: "Azúcar Manuelita",
                Ent_username: "manuelita"
            }
        });
        done()
    });
    it("Should return status 400 if Ent_NIT has spaces", async (done) => {
        await request.post("/enterprise/create")
        .send({
            "NIT": "soy una empresa",
            "name": "Azúcar Manuelita",
            "description": "Este espacio es patrocinado por azúcar manuelita, que refina el mejor azúcar del país",
            "budget": 800000000.011,
            "username":"manuelita",
            "password": "azucar",
            "month_limit": 6500000,
            "movement_limit": 3900000
        })
        .expect('Content-Type', /text/)
        .expect(400,"Enterprise NIT can't contain spaces");
        done()
    });
    it("Should return status 400 if username has spaces", async (done) => {
        await request.post("/enterprise/create")
        .send({
            "NIT": "soy-una-empresa",
            "name": "Azúcar Manuelita",
            "description": "Este espacio es patrocinado por azúcar manuelita, que refina el mejor azúcar del país",
            "budget": 800000000.011,
            "username":"manuelita con espacios", 
            "password": "azucar",
            "month_limit": 6500000,
            "movement_limit": 3900000
        })
        .expect('Content-Type', /text/)
        .expect(400,"Enterprise username can't contain spaces");
        done()
    });
});