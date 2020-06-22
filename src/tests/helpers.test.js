const { encryptPassword, matchPassword, isWalletState, hasNoSpaces, loggerInfoAndResponse,
    loggerWarnAndResponse, loggerErrorAndResponse, generateToken, beginTokenValidation } = require("../lib/helpers");
const app = require('../index')
const supertest = require('supertest');
const request = supertest(app)

describe("helpers.encryptPassword Tests", () => {
    it("encryptPassword should return a encrypted password correctly", async () => {
        const answer = await encryptPassword("my-password");
        const expected = "$2b$10$"; //Common encryption string header
        expect(answer).toEqual(expect.stringContaining(expected));
    })
    it("encryptPassword of null should return undefined", async () => {
        const answer = await encryptPassword(null);
        expect(answer).toEqual(undefined);
    })
});

describe("helpers.matchPassword Tests", () => {
    it("matchPassword should return true when password is the same", async () => {
        const password = "my-password";
        const mockSavedPass = await encryptPassword(password);
        const answer = await matchPassword(password, mockSavedPass);
        expect(answer).toBe(true);
    });
    it("matchPassword should return false when password are not equal to the stored password", async () => {
        const password = "my-password";
        const mockSavedPass = await encryptPassword("another-password");
        const answer = await matchPassword(password, mockSavedPass);
        expect(answer).toBe(false);
    });
    it("matchPassword should return undefined if one of the arguments is null", async () => {
        const password = null;
        const mockSavedPass = await encryptPassword("another-password");
        const answer = await matchPassword(password, mockSavedPass);
        expect(answer).toBe(undefined);
    });
});

describe('helpers.isWalletState Tests', () => {
    it("isWalletState should return same value", () => {
        let answer = isWalletState("Active");
        expect(answer).toBe("Active");
        answer = isWalletState("Inactive");
        expect(answer).toBe("Inactive");
    });

    it("isWalletState should return null", () => {
        const answer = isWalletState("Other value");
        expect(answer).toBe(null);
    });

    it("isWalletState should return same value", () => {
        const answer = isWalletState("Active");
        expect(answer).toBe("Active");
    });
});

describe("helpers.hasNoSpaces Tests", () => {
    it("hasNoSpaces should return same string", () => {
        const answer = hasNoSpaces("String-without-spaces");
        expect(answer).toBe("String-without-spaces");
    });
    it("hasNoSpaces should return null", () => {
        const answer = hasNoSpaces("String with spaces");
        expect(answer).toBe(null);
    });
});

/*const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.text = jest.fn().mockReturnValue(res);
    return res;
  };*/

describe("helpers.loggerInfoAndResponse Tests", () => {
    it("loggerInfoAndResponse should return determined request", async () => {
        const response = await request.get('/test')
        loggerInfoAndResponse(200, response, "Example message All Correct")
        expect(response.status).toBe(200); //Provisional
    });
    it("loggerInfoAndResponse should return determined request", async () => {
        const response = await request.get('/test')
        loggerInfoAndResponse(404, response, "Example message All Correct")
        expect(response.status).toBe(200); //Provisional
    });
    /*it("loggerInfoAndResponse should return determined request", async (done) => {
        const expected = {"user":{}} //String in json that returns current user
        const response = await
            request
                .post('/user/login')
                .set("access-token","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI2OTAxNzUsImV4cCI6MTU5NTI4MjE3NX0.a1iGSFPz8wBt1JtJLIt6GUs9Ewelv-KHIyhC8r6_OHk")
                .send(
                    {
                        "username": "miapenahu",
                        "password": "Abcd1234"
                    }
                )
                //.expect('Content-Type',"text/html; charset=utf-8")
                .expect('Content-Type', /json/)
                .expect(200);
                loggerInfoAndResponse(200, response, "Example message All Correct");
                done()
    });*/
});

describe("helpers.loggerWarnAndResponse Tests", () => {
    it("loggerInfoAndResponse should return determined request", async () => {
        const response = await request.get('/banco/')
        loggerWarnAndResponse(404, response, "Example message not found")
        expect(response.status).toBe(404); //Provisional
    });
});

describe("helpers.loggerWarnAndResponse Tests", () => {
    it("loggerInfoAndResponse should return determined request", async () => {
        const response = await request.post("/bank/creation") //Not recognized method causes app to explode 
        loggerErrorAndResponse(response, "Example message not found")
        expect(response.status).toBe(403); //Provisional
    });
});

describe("helpers.generateToken Tests", () => {
    it("generateToken should return token without spaces", () => {
        const answer = generateToken(100);
        const expected = " ";
        expect(answer).toEqual(expect.not.stringContaining(expected));
    });
    it("generateToken should return token of the form xxxxxx.yyyyyy.zzzzz", () => {
        const answer = generateToken(100);
        const expected = /\.+/;
        expect(answer).toEqual(expect.stringMatching(expected));
    });
});

describe("helpers.beginTokenValidation Tests", () => {
    it("beginTokenValidation should return token doesnt provided", async () => {
        await request.get('/user/find/all')
            .expect('Content-Type', "text/html; charset=utf-8")
            //.expect('Content-Type', "application/json; charset=utf-8")
            .expect(403, "Token doesn't provided");
    });
    it("beginTokenValidation should return invalid token", async () => {
        await request.get('/user/find/all')
            .set("access-token", "Invalid_token")
            .expect('Content-Type', "text/html; charset=utf-8")
            //.expect('Content-Type', "application/json; charset=utf-8")
            .expect(403, "Invalid token");
    });

});

