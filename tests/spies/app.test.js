const expect = require('expect');
const rewire = require('rewire');

const app = rewire('./app');


describe('App', () => {
    it('should call spy correctly', () => {
        const spy = expect.createSpy();
        spy('Idem', false);
        expect(spy).toHaveBeenCalled();
    });

    it('should call saveUser with user object', () => {
        const db = {
            saveUser: expect.createSpy()
        };
        app.__set__('db', db);

        const email = 'ibangaenoobong@yahoo.com';
        const password = '111222er';

        app.handleSignup(email, password);

        expect(db.saveUser).toHaveBeenCalledWith({email, password})
    });
});