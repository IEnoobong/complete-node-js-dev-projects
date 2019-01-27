const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.get('/users', (req, res) => {
    const user1 = {
        name: 'Eno',
        age: 13
    };
    const user2 = {
        name: 'Emma',
        age: 12
    };

    const user3 = {
        name: 'Sam',
        age: 14
    };

    const users = [user1, user2, user3];

    res.send(users)
});

app.listen(3000);

module.exports.app = app;