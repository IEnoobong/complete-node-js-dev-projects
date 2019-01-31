class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        const user = {id, name, room};
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

    getUser(id) {
        return this.users.find(user => user.id === id)
    }

    getUserList(room) {
        const users = this.users.filter(user => user.room === room);
        return users.map(user => user.name);
    }


}

module.exports = {Users};