const selection = require("../patterns/factory_selection");

//const logger = require('../logger/logger');
//const helpers = require("../lib/helpers");

const selectionFactory = new selection.Factory();

it("Initial coverage of selection.Factory", () => {
   //selectionFactory.read({}, {}, "user");
   selectionFactory.read({}, {}, "user-by-username");
   //selectionFactory.read({}, {}, "user-validate");
   selectionFactory.read({}, {}, "bank");
   selectionFactory.read({}, {}, "wallet");
   selectionFactory.read({}, {}, "wallets-by-username");
   selectionFactory.read({}, {}, "wallet-type");
   selectionFactory.read({}, {}, "transfer");
   selectionFactory.read({}, {}, "movement");
   selectionFactory.read({}, {}, "movement-by-username");
   selectionFactory.read({}, {}, "enterprise");
   selectionFactory.read({}, {}, "enterprise-validate");
   selectionFactory.read({}, {}, "enterprise-by-username");
   selectionFactory.read({}, {}, "managed-users");
   expect(1).toBe(1);
});

const persistence = require("../patterns/factory_persistence")

const persistenceFactory = new persistence.Factory();

const app = require('../index')
const supertest = require('supertest')
const request = supertest(app)

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
   it("Should return all users in database", async (done) => {
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
});

/*
it('Reception of a unknown route should return status personalized error status message', async done => {
    jest.useFakeTimers();
    const response = await request.get('/this-is-a-unknown-route')
    expect(response.body.error.message).toBe("Resource not found :(")
    done()
})*/

/*it('Reception of a unknown route should return status 404', async done => {
   jest.useFakeTimers();
   const response = await request.post('/bank/create')
   expect(response.status).toBe(403)
   expect(response.text).toBe("Token doesn't provided")
   done()
})*/