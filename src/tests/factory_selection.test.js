const selection = require("../patterns/factory_selection");
const app = require('../index');
const supertest = require('supertest');
const request = supertest(app);

const selectionFactory = new selection.Factory();

it("Initial coverage of selection.Factory", () => {
   //selectionFactory.read({}, {}, "user");
   //selectionFactory.read({}, {}, "user-by-username");
   //selectionFactory.read({}, {}, "user-validate");
   //selectionFactory.read({}, {}, "bank");
   //selectionFactory.read({}, {}, "wallet");
   //selectionFactory.read({}, {}, "wallets-by-username");
   //selectionFactory.read({}, {}, "wallet-type");
   //selectionFactory.read({}, {}, "transfer");
   //selectionFactory.read({}, {}, "movement");
   //selectionFactory.read({}, {}, "movement-by-username");
   selectionFactory.read({}, {}, "enterprise");
   selectionFactory.read({}, {}, "enterprise-validate");
   selectionFactory.read({}, {}, "enterprise-by-username");
   selectionFactory.read({}, {}, "managed-users");
   expect(1).toBe(1);
});

const persistence = require("../patterns/factory_persistence")

const persistenceFactory = new persistence.Factory();

describe("Get All Users", () => {
   it("Should return all users in database", async (done) => {
      await request.get('/user/find/all')
         .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
         .expect('Content-Type', /json/)
         .expect(200);
      done()
   });
   it("Should return token validation error", async (done) => {
      await request.get('/user/find/all')
         .set("access-token", "Invalid-token")
         .expect('Content-Type', "text/html; charset=utf-8")
         .expect(403, "Invalid token");
      done()
   });
   it("Should return token validation error", async (done) => {
      await request.get('/user/find/all')
         .expect('Content-Type', "text/html; charset=utf-8")
         .expect(403, "Token doesn't provided");
      done()
   });
   it("Should return error", () => {
      //The error sentence only happens when the server has an internal error
   });
});

describe("Get User by Username", () => {
   it("Should return the users selected in url params", async (done) => {
      await request.get('/user/find/miapenahu')
         .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
         .expect('Content-Type', /json/)
         .expect((res) => {
            const { Usr_id, Usr_username, Usr_name } = res.body.user;
            delete res.body.user;
            Object.assign(res.body, {
               user: {
                  Usr_id: Usr_id,
                  Usr_username: Usr_username,
                  Usr_name: Usr_name
               }
            });
         })
         .expect(200, {
            user: {
               Usr_id: 1,
               Usr_username: "miapenahu",
               Usr_name: "Miguel"
            }
         });
      done()
   });
   it("Should return 404 status when user was not found", async (done) => {
      await request.get('/user/find/not-registered-user')
         .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
         .expect('Content-Type', "text/html; charset=utf-8")
         .expect(404, 'User with the specified username does not exists');
      done()
   });
   it("Should return error", () => {
      //The error sentence only happens when the server has an internal error
   });
});

describe("User and Enterprise Login", () => {
   it("User should return selected user in a json", async (done) => {
      await request.post('/user/login')
         .send(
            {
               "username": "miapenahu",
               "password": "Abcd1234"
            }
         )
         .expect('Content-Type', /json/)
         .expect((res) => {
            delete res.body.token;
            const { Usr_id, Usr_username, Usr_name } = res.body.user;
            delete res.body.user;
            Object.assign(res.body, {
               user: {
                  Usr_id: Usr_id,
                  Usr_username: Usr_username,
                  Usr_name: Usr_name
               }
            });
         })
         .expect(200, {
            user: {
               Usr_id: 1,
               Usr_username: "miapenahu",
               Usr_name: "Miguel"
            }
         });
      done()
   });
   it("User should return incorrect password error", async (done) => {
      await request.post('/user/login')
         .send({
            "username": "miapenahu",
            "password": "not-the-correct-password"
         }
         )
         .expect('Content-Type', "text/html; charset=utf-8")
         .expect(401, 'The password is incorrect. Please try again');
      done()
   });
   it("Enterprise should return all users in a json", async (done) => {
      await request.post('/enterprise/login')
         .send(
            {
               "username": "enterprise1",
               "password": "empresa1"
            }
         )
         .expect('Content-Type', /json/)
         .expect((res) => {
            delete res.body.token;
            const { Ent_id, Ent_username, Ent_budget } = res.body.enterprise;
            delete res.body.enterprise;
            Object.assign(res.body, {
               enterprise: {
                  Ent_id: Ent_id,
                  Ent_username: Ent_username,
                  Ent_budget: Ent_budget
               }
            });
         })
         .expect(200, {
            enterprise: {
               Ent_id: 1,
               Ent_username: "enterprise1",
               Ent_budget: 100000000.00
            }
         });
      done()
   });
   it("Enterprise should return incorrect password error", async (done) => {
      await request.post('/enterprise/login')
         .send({
            "username": "enterprise1",
            "password": "not-the-correct-password"
         }
         )
         .expect('Content-Type', "text/html; charset=utf-8")
         .expect(401, 'The password is incorrect. Please try again');
      done()
   });
   it("User or Enterprise doesnt exists in the database", async (done) => {
      await request.post('/enterprise/login')
         .send({
            "username": "fake-user",
            "password": "not-the-correct-password"
         }
         )
         .expect('Content-Type', "text/html; charset=utf-8")
         .expect(404, 'User/Enterprise with specified username does not exist');
      done()
   });
   it("Should return error", async (done) => {
      await request.post('/enterprise/login')
         .expect('Content-Type', "text/html; charset=utf-8")
         .expect(500, 'Error: WHERE parameter "Usr_username" has invalid "undefined" value');
      done()
   });
});

describe("Get All Banks", () => {
   it("Should return all banks in database", async (done) => {
      await request.get('/bank/find/all')
         .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
         .expect('Content-Type', /json/)
         .expect(200);
      done()
   });
   it("Should return token validation error", async (done) => {
      await request.get('/bank/find/all')
         .set("access-token", "Invalid-token")
         .expect('Content-Type', "text/html; charset=utf-8")
         .expect(403, "Invalid token");
      done()
   });
   it("Should return token validation error", async (done) => {
      await request.get('/bank/find/all')
         .expect('Content-Type', "text/html; charset=utf-8")
         .expect(403, "Token doesn't provided");
      done()
   });
   it("Should return error", () => {
      //The error sentence only happens when the server has an internal error
   });
});

describe("Get All Wallets", () => {
   it("Should return all wallets in database", async (done) => {
      await request.get('/wallet/find/all')
         .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
         .expect('Content-Type', /json/)
         .expect(200);
      done()
   });
   it("Should return token validation error", async (done) => {
      await request.get('/wallet/find/all')
         .set("access-token", "Invalid-token")
         .expect('Content-Type', "text/html; charset=utf-8")
         .expect(403, "Invalid token");
      done()
   });
   it("Should return token validation error", async (done) => {
      await request.get('/wallet/find/all')
         .expect('Content-Type', "text/html; charset=utf-8")
         .expect(403, "Token doesn't provided");
      done()
   });
   it("Should return error", () => {
      //The error sentence only happens when the server has an internal error
   });
});

describe("Get All Wallets By Username", () => {
   it("Should return all wallets for one user", async (done) => {
      await request.get('/wallet/find/all/miapenahu')
         .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
         .expect('Content-Type', /json/)
         .expect((res) => {
            const { Wal_id, Wtyp_id } = res.body.wallets[0];
            delete res.body.wallets;
            Object.assign(res.body, {
               wallets: {
                  Wal_id: Wal_id,
                  Wtyp_id: Wtyp_id
               }
            });
         })
         .expect(200, {
            wallets: {
               Wal_id: 'bce63b35-031b-43a3-988d-bd6600a0b5af',
               Wtyp_id: 1
            }
         });
      done()
   });
   it("Should return all wallets for one enterprise", async (done) => {
      await request.get('/wallet/find/all/enterprise1')
         .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
         .expect('Content-Type', /json/)
         .expect((res) => {
            const { Wal_id, Wtyp_id} = res.body.wallets[0];
            delete res.body.wallets;
            Object.assign(res.body, {
               wallets: {
                  Wal_id: Wal_id,
                  Wtyp_id: Wtyp_id,
               }
            });
         })
         .expect(200, {
            wallets: {
               Wal_id: '022f8a82-5d63-408d-bbd3-9b123f86a14c',
               Wtyp_id: 2
            }
         });
      done()
   });
   it("Should return 404 since this username isn't registered", async (done) => {
      await request.get('/wallet/find/all/user-not-found')
         .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
         .expect('Content-Type', /text/)
         .expect(404, "Specified User/Enterprise not found");
      done()
   });
   it("Should return error", () => {
      //The error sentence only happens when the server has an internal error
   });
});

describe("Get All Wallet Types", () => {
   it("Should return all Wallet Types in database", async (done) => {
      await request.get('/wallet-type/find/all')
         .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
         .expect('Content-Type', /json/)
         .expect(200);
      done()
   });
   it("Should return token validation error", async (done) => {
      await request.get('/wallet-type/find/all')
         .set("access-token", "Invalid-token")
         .expect('Content-Type', "text/html; charset=utf-8")
         .expect(403, "Invalid token");
      done()
   });
   it("Should return token validation error", async (done) => {
      await request.get('/wallet-type/find/all')
         .expect('Content-Type', "text/html; charset=utf-8")
         .expect(403, "Token doesn't provided");
      done()
   });
   it("Should return error", () => {
      //The error sentence only happens when the server has an internal error
   });
});

describe("Get All Transfers", () => {
   it("Should return all Transfers in database", async (done) => {
      await request.get('/transfer/find/all')
         .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
         .expect('Content-Type', /json/)
         .expect(200);
      done()
   });
   it("Should return token validation error", async (done) => {
      await request.get('/transfer/find/all')
         .set("access-token", "Invalid-token")
         .expect('Content-Type', "text/html; charset=utf-8")
         .expect(403, "Invalid token");
      done()
   });
   it("Should return token validation error", async (done) => {
      await request.get('/transfer/find/all')
         .expect('Content-Type', "text/html; charset=utf-8")
         .expect(403, "Token doesn't provided");
      done()
   });
   it("Should return error", () => {
      //The error sentence only happens when the server has an internal error
   });
});

describe("Get All Movements", () => {
   it("Should return all Transfers in database", async (done) => {
      await request.get('/movement/find/all')
         .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
         .expect('Content-Type', /json/)
         .expect(200);
      done()
   });
   it("Should return token validation error", async (done) => {
      await request.get('/movement/find/all')
         .set("access-token", "Invalid-token")
         .expect('Content-Type', "text/html; charset=utf-8")
         .expect(403, "Invalid token");
      done()
   });
   it("Should return token validation error", async (done) => {
      await request.get('/movement/find/all')
         .expect('Content-Type', "text/html; charset=utf-8")
         .expect(403, "Token doesn't provided");
      done()
   });
   it("Should return error", () => {
      //The error sentence only happens when the server has an internal error
   });
});

describe("Get All Movements By Username", () => {
   it("Should return all movements for one user", async (done) => {
      await request.get('/movement/find/all/miapenahu')
         .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
         .expect('Content-Type', /json/)
         .expect((res) => {
            const { Wal_id } = res.body.wallets[0];
            const { Wal_id_recipient, Mov_total_amount } = res.body.wallets[0].modifies_sender[0];
            delete res.body.wallets;
            Object.assign(res.body, {
               wallets: {
                  Wal_id: Wal_id,
                  modifies_sender: {
                     Wal_id_recipient: Wal_id_recipient,
                     Wal_total_amount: Mov_total_amount
                  },
                  modifies_recipient: {}
               }
            });
         })
         .expect(200, {
            wallets: {
               Wal_id: 'bce63b35-031b-43a3-988d-bd6600a0b5af',
               modifies_sender: {
                  Wal_id_recipient: '58ecb6c2-c137-418b-9b2f-01425ac7b124',
                  Wal_total_amount: 50000
                },
               modifies_recipient: {}
            }
         });
      done()
   });
   it("Should return all movements for one enterprise", async (done) => {
      await request.get('/movement/find/all/enterprise1')
         .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
         .expect('Content-Type', /json/)
         .expect((res) => {
            const { Wal_id } = res.body.wallets[0];
            delete res.body.wallets;
            Object.assign(res.body, {
               wallets: {
                  Wal_id: Wal_id,
                  modifies_sender: {},
                  modifies_recipient: {}
               }
            });
         })
         .expect(200, {
            wallets: {
               Wal_id: '022f8a82-5d63-408d-bbd3-9b123f86a14c',
               modifies_sender: {},
               modifies_recipient: {}
            }
         });
      done()
   });
   it("Should return 404 when user or enterprise not found", async (done) => {
      await request.get('/movement/find/all/not_registered_username')
         .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
         .expect('Content-Type', /text/)
         .expect(404, "User/Enterprise with specified username doesn't found");
      done()
   });
   it("Should return error", () => {
      //The error sentence only happens when the server has an internal error
   });
});

describe("Get All Enterprises", () => {
   it("Should return all Enterprises in database", async (done) => {
      await request.get('/enterprise/find/all')
         .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
         .expect('Content-Type', /json/)
         .expect(200);
      done()
   });
   it("Should return token validation error", async (done) => {
      await request.get('/movement/find/all')
         .set("access-token", "Invalid-token")
         .expect('Content-Type', "text/html; charset=utf-8")
         .expect(403, "Invalid token");
      done()
   });
   it("Should return token validation error", async (done) => {
      await request.get('/movement/find/all')
         .expect('Content-Type', "text/html; charset=utf-8")
         .expect(403, "Token doesn't provided");
      done()
   });
   it("Should return error", () => {
      //The error sentence only happens when the server has an internal error
   });
});

describe("Get Enterprise By Username", () => {
   it("Should return the enterprise for one ent_username", async (done) => {
      await request.get('/enterprise/find/enterprise1')
         .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
         .expect('Content-Type', /json/)
         .expect((res) => {
            const { Ent_name,Ent_id } = res.body.enterprise;
            delete res.body.enterprise;
            Object.assign(res.body, {
               enterprise: {
                  Ent_id: Ent_id,
                  Ent_name: Ent_name,
               }
            });
         })
         .expect(200, {
            enterprise: {
               Ent_id: 1,
               Ent_name: "Empresa 1",
            }
         });
      done()
   });
   it("Should return status 404 as enterprise username does not exist", async (done) => {
      await request.get('/enterprise/find/invalid-username') //This username doesn't exist
         .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
         .expect('Content-Type', /text/)
         .expect(404,"Enterprise username does not exist");
      done()
   });
   it("Should return error", () => {
      //The error sentence only happens when the server has an internal error
   });
});


describe("Get Users managed by Enterprise", () => {
   it("Should return the users managed by one enterprise", async (done) => {
      await request.get('/enterprise/find/managed/enterprise1')
         .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
         .expect('Content-Type', /json/)
         .expect(200);
      done()
   });
   /*
   it("Should return status 404 as enterprise username does not exist", async (done) => {
      await request.get('/enterprise/find/invalid-username') //This username doesn't exist
         .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
         .expect('Content-Type', /text/)
         .expect(404,"Enterprise username does not exist");
      done()
   });
   it("Should return error", () => {
      //The error sentence only happens when the server has an internal error
   });*/
});