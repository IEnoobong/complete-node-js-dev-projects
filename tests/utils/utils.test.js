const expect = require('expect');
// const assert = require('assert');

const utils = require('./utils');

describe('Utils', () => {
    it('should add two numbers', () => {
        const res = utils.add(11, 33);

        expect(res).toBeA('number').toBe(44);
        // assert.strictEqual(res, 44)
    });

    describe('Async', () => {
        it('should add two numbers async', done => {
            utils.asyncAdd(12, 3, (sum) => {
                expect(sum).toBeA('number').toBe(15);
                done();
            })
        });

        it('should square a number async', done => {
            utils.asyncSquare(5, (square) => {
                expect(square).toBeA('number').toBe(25);
                done();
            })
        });
    });

    it('should square a number', () => {
        const res = utils.square(4);

        expect(res).toBe(16);
        // assert.strictEqual(res, 16);
    });

    it('should include first name and last name', () => {
        const user = {location: 'Lagos', age: 13};
        const res = utils.setName(user, 'Eno Ibanga');

        expect(res).toEqual(user);
        expect(res).toInclude({
            firstName: 'Eno',
            lastName: 'Ibanga'
        })
    });
});