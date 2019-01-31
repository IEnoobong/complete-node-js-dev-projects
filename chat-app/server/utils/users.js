class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        const roomRep = room.toLocaleUpperCase();
        const user = {id, name, room, roomRep};
        this.users.push(user);
        return user
    }

    removeUser(id) {
        const foundUser = this.getUser(id);
        if (foundUser) {
            const index = this.users.findIndex(user => user === foundUser);
            this.users.splice(index, 1);
        }
        return foundUser;
    }

    userExistsWithName(name, room) {
        return this.users.some(user => user.name === name && user.room === room)
    }

    getActiveRooms() {
        return [...new Set(this.users.map(user => user.roomRep))]
    }

    getUser(id) {
        return this.users.find(user => user.id === id)
    }

    getUserList(roomRep) {
        const users = this.users.filter(user => user.roomRep === roomRep);
        return users.map(user => user.name);
    }


}

module.exports = {Users};