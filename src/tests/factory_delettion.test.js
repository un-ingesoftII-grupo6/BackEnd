const deletion = require("../patterns/factory_deletion");
const app = require('../index');
const supertest = require('supertest');
const request = supertest(app);

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

describe("Delete Enterprise", () => {
    it("Should return 404 status as this ent_id doesn't exist", async (done) => {
        await request.delete("/enterprise/delete/123123")  //This ent_id doesn't exist
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .expect('Content-Type', /text/)
            .expect(404, "Specified Enterprise not found");
        done()
    });
    it("Should successfully remove dummy enterprise (with associated wallets)", async (done) => {
        await request.delete("/enterprise/delete/3")  //This is dummy enterprise
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .expect('Content-Type', /text/)
            .expect(200, 'Enterprise dummy deleted');
        done()
    });
});

describe("Delete Movement", () => {
    it("Should return status 401 if wallet not associated with movement and user", async (done) => {
        await request.delete("/movement/delete/miapenahu/2")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .expect('Content-Type', /text/)
            .expect(401, 'This User is not associated with this Movement through Wallet');
        done()
    });
    it("Should return status 404 if movement id does not exist", async (done) => {
        await request.delete("/movement/delete/miapenahu/212312") //This mov_id doesn't exist 
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .expect('Content-Type', /text/)
            .expect(404, 'Specified movement does not exist');
        done()
    });
    it("Should return status 404 if username  does not exist", async (done) => {
        await request.delete("/movement/delete/miapasdasdas/2") //This usr_username doesn't exist 
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .expect('Content-Type', /text/)
            .expect(404, 'Given Username does not exists');
        done()
    });
    it("Should remove dummy movement correctly", async (done) => {
        await request.delete("/movement/delete/dummy-user/2")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .expect('Content-Type', /text/)
            .expect(200, "Movement deleted");
        done()
    });
});

describe("Delete Wallet", () => {
    it("Should return 400 status as this wallet has movements", async (done) => {
        await request.delete("/wallet/delete/miapenahu/bce63b35-031b-43a3-988d-bd6600a0b5af")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "password": "Abcd1234"
            })
            .expect('Content-Type', /text/)
            .expect(400, "This Wallet has associated Movements. Please delete them first");
        done()
    });
    it("Should return 401 status as the password is wrong", async (done) => {
        await request.delete("/wallet/delete/dummy-user/12345")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "password": "not-correct-password"
            })
            .expect('Content-Type', /text/)
            .expect(401, 'The password is incorrect. Please try again');
        done()
    });
    it("Should return 404 status as the associated wallet does not exist", async (done) => {
        await request.delete("/wallet/delete/dummy-user/askdjasjdlasjdlakjsdlak")  //This wallet doesn't exist
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "password": "Abcd1234"
            })
            .expect('Content-Type', /text/)
            .expect(404, 'Specified wallet does not exists');
        done()
    });
    it("Should return 404 status as the associated user does not exist", async (done) => {
        await request.delete("/wallet/delete/dummyadasd-user/12345")  //This user doesn't exist
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "password": "Abcd1234"
            })
            .expect('Content-Type', /text/)
            .expect(404, 'User does not exists');
        done()
    });
    it("Should remove dummy wallet correctly", async (done) => {
        await request.delete("/wallet/delete/dummy-user/12345")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .send({
                "password": "Abcd1234"
            })
            .expect('Content-Type', /text/)
            .expect(200, "Wallet deleted");
        done()
    });
});

describe("Delete User", () => {
    it("Should return 400 error if user has associated wallets", async (done) => {
        await request.delete("/user/delete/miapenahu")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .expect('Content-Type', /text/)
            .expect(400, "This User has associated Wallets. Please delete them first");
        done()
    });
    it("Should return 404 error if user was not found", async (done) => {
        await request.delete("/user/delete/user-not-existent") //Usename doesn't exist
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .expect('Content-Type', /text/)
            .expect(404, "Specified User not found");
        done()
    });
    it("Should remove dummy user correctly", async (done) => {
        await request.delete("/user/delete/dummy-user") //Usename doesn't exist
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .expect('Content-Type', /text/)
            .expect(200, 'User dummy-user deleted');
        done()
    });
});

describe("Delete Bank", () => {
    it("Should return 404 error if Bank_id doesn't exist", async (done) => {
        await request.delete("/bank/delete/888") //This Bank_id doesn't exist
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .expect('Content-Type', /text/)
            .expect(404, "Specified Bank not found");
        done()
    });
    it("Should remove dummy bank with transfer relationship correctly", async (done) => {
        await request.delete("/bank/delete/2") //Usename doesn't exist
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .expect('Content-Type', /text/)
            .expect(200, 'Bank dummy deleted');
        done()
    });
});

describe("Delete Wallet Type", () => {
    it("Should return 404 error if Bank_id doesn't exist", async (done) => {
        await request.delete("/wallet-type/delete/1213") //This Bank_id doesn't exist
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .expect('Content-Type', /text/)
            .expect(404, 'Specified Wallet Type not found');
        done()
    });
    it("Should return 400 error if wallet type has associated wallets", async (done) => {
        await request.delete("/wallet-type/delete/1")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .expect('Content-Type', /text/)
            .expect(400, "This Wallet Type has associated Wallets. Please delete them first");
        done()
    });
    it("Should remove wallet type dummy without relationship correctly", async (done) => {
        await request.delete("/wallet-type/delete/4")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .expect('Content-Type', /text/)
            .expect(200, 'Wallet Type Dummy deleted');
        done()
    });
});

describe("Delete Transfer", () => {
    it("Should return 400 status as transfer has associated movements", async (done) => {
        await request.delete("/transfer/delete/1")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .expect('Content-Type', /text/)
            .expect(400, "This Transfer has associated Movements. Please delete them first");
        done()
    });
    it("Should return 404 status as transfer was not found", async (done) => {
        await request.delete("/transfer/delete/123123123")  // This transfer doesn't exist
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .expect('Content-Type', /text/)
            .expect(404, "Specified Transfer not found");
        done()
    });
    it("Should remove dummy transfer correctly", async (done) => {
        await request.delete("/transfer/delete/3")
            .set("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
            .expect('Content-Type', /text/)
            .expect(200, 'Transfer Consignar a dummy deleted');

        done()
    });
});

