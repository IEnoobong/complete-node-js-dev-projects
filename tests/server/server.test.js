const request = require('supertest');
const expect = require('expect');

const app = require('./server').app;

describe('Server', () => {
    describe('GET /', () => {
        it('should return hello world response', done => {
            request(app)
                .get('/')
                .expect(200)
                .expect(res => {
                    expect(res.text).toBeA('string').toBe('Hello World!')
                })
                .end(done);
        });
    });
    describe('GET /users', () => {
        it('should return set user', done => {
            request(app)
                .get('/users')
                .expect(200)
                .expect(res => {
                    expect(res.body).toBeA('array').toInclude({
                        name: 'Eno',
                        age: 13
                    })
                })
                .end(done)
        });
    });
});
