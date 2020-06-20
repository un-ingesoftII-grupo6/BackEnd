//const persistence = require("../patterns/factory_persistence")

//const persistenceFactory = new persistence.Factory();
//'use strict';

const app = require('../index')
const supertest = require('supertest')
const request = supertest(app)


/*const http = require('http');

// This test fails because 1 !== 2
it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
  })

it('Gets the test endpoint', async done => {
    // Sends GET Request to /test endpoint
    const response = await request.get('/test')
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('pass!')
    done()
})*/

it('Reception of a unknown route', async done => {
    jest.useFakeTimers();
    const response = await request.get('/this-is-a-unknown-route')
    expect(response.status).toBe(404)
    expect(response.body.error.message).toBe("Resource not found :(")
    done()
})