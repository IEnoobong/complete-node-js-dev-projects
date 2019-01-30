const expect = require('expect');
const {generateMessage, generateLocationMessage} = require('./message');

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

describe('generateLocationMessage', () => {
    it('should generate correct location message', () => {
        const from = 'Enoobong';
        const latitude = 1;
        const longitude = 0;
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;

        const message = generateLocationMessage(from, latitude, longitude);

        expect(message.createdAt).toBeA(Date);
        expect(message).toInclude({from, url})

    });
});