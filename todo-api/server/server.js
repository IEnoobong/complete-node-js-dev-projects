const express = require('express');
const bodyParser = require('body-parser');

const {User} = require('./models/users');
const {Todo} = require('./models/todo');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text

    });

    todo.save().then(doc => {
        res.send(doc)
    }, err => {
        res.status(400).send(err)
    })
});

app.get('/todos', (req, res) => {

});

app.get('/todos/:id', (req, res) => {

});


app.listen(3000, () => {

});