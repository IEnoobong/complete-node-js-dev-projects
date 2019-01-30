const expect = require('expect');
const {generateMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        const from = 'Enoobong';
        const text = 'My Faith is Tenacious';

        const message = generateMessage(from, text);

        expect(message.from).toBeA('string').toBe(from);
        expect(message.text).toBeA('string').toBe(text);
        expect(message.createdAt).toBeA(Date);
    });
});