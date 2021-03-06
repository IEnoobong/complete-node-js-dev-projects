const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {User} = require('./../../models/users');
const {Todo} = require('./../../models/todo');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'eno@yahoo.com',
    password: 'yagaba1',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId.toHexString(), access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userTwoId,
    email: 'enoobong@yahoo.com',
    password: 'yagaba2',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId.toHexString(), access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}];

const populateUsers = done => {
    User.deleteMany({}).then(() => {
        const userOne = new User(users[0]).save();
        const userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo])
    }).then(() => done())
};

const todos = [{
    _id: new ObjectID(),
    text: 'First todo',
    _createdBy: userOneId
}, {
    _id: new ObjectID(),
    text: 'Second todo',
    completed: true,
    completedAt: new Date(),
    _createdBy: userTwoId
}];

const populateTodos = done => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());

};

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
};