const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/users');

const todos = [{
    _id: new ObjectID(),
    text: 'First todo'
}, {
    _id: new ObjectID(),
    text: 'Second todo',
    completed: true,
    completedAt: new Date()
}];

const populateTodos = done => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());

};

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'eno@yahoo.com',
    password: 'yagaba1',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId.toHexString(), access: 'auth'}, 'supersecretmess').toString()
    }]
}, {
    _id: userTwoId,
    email: 'enoobong@yahoo.com',
    password: 'yagaba2',
}];

const populateUsers = done => {
    User.deleteMany({}).then(() => {
        const userOne = new User(users[0]).save();
        const userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo])
    }).then(() => done())
};

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
};