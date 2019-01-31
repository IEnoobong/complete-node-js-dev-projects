const expect = require('expect');
const {Users} = require('./users');

describe('Users', () => {

    let users;
    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Eno',
            room: "Christs'",
            roomRep: "CHRISTS'"
        }, {
            id: '2',
            name: 'Sam',
            room: "Christs'",
            roomRep: "CHRISTS'"
        }, {
            id: '3',
            name: 'James',
            room: "TemBe",
            roomRep: "TEMBE"
        }];
    });

    it('should add new user', () => {
        const users = new Users();
        const user = {
            id: '1234',
            name: 'Eno',
            room: "Christs'",
            roomRep: "CHRISTS'"
        };

        users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user])
    });

    it('should return names for room', function () {
        const usersList = users.getUserList("CHRISTS'");

        expect(usersList).toEqual([users.users[0].name, users.users[1].name])
    });

    it('should find a user', function () {
        const user = users.getUser('1');

        expect(user).toEqual(users.users[0])
    });

    it('should not find user', function () {
        const user = users.getUser('10');

        expect(user).toNotExist();
    });

    it('should remove a user', function () {
        const userId = '1';
        const user = users.removeUser(userId);

        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });

    it('should not remove user', function () {
        const user = users.removeUser('10');

        expect(user).toNotExist();
        expect(users.users.length).toBe(3)
    });
});