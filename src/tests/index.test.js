const app = require('../index')
const supertest = require('supertest')
const request = supertest(app)

it('Reception of a unknown route should return status 404', async done => {
    jest.useFakeTimers();
    const response = await request.get('/this-is-a-unknown-route')
    expect(response.status).toBe(404)
    done()
})

it('Reception of test route should return message', async done => {
    jest.useFakeTimers();
    const response = await request.get('/test')
    expect(response.body.message).toBe("pass!")
    done()
})

it('Reception of a unknown route should return status personalized error status message', async done => {
    jest.useFakeTimers();
    const response = await request.get('/this-is-a-unknown-route')
    expect(response.body.error.message).toBe("Resource not found :(")
    done()
})

