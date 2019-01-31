const expect = require('expect');
const {isRealString} = require('./validation');

describe('isRealString', () => {
    it('should reject non string values', () => {
        const isString = isRealString(new Date());

        expect(isString).toBe(false)
    });

    it('should reject strings with only spaces', () => {
        const isString = isRealString('           ');

        expect(isString).toBe(false)
    });

    it('should allow strings with non-space characters', () => {
        const isString = isRealString('  Yoloboy   ');

        expect(isString).toBe(true)
    });
});