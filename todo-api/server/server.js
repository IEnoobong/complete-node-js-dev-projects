const express = require('express');
const bodyParser = require('body-parser');

const {User} = require('./models/users');
const {Todo} = require('./models/todo');
const {ObjectID} = require('mongodb');

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text

    });

    todo.save().then(doc => {
        res.status(201).send(doc)
    }, err => {
        res.status(400).send(err)
    })
});

app.get('/todos', (req, res) => {
    Todo.find().then(todos => {
        res.send({todos})
    }, err => {
        res.status(400).send(err)
    })
});

app.get('/todos/:id', (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    Todo.findById(id).then(todo => {
        if (todo) {
            return res.status(200).send({todo})
        } else {
            return res.status(404).send()
        }
    }).catch(() => {
        return res.status(400).send()
    });

});

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    Todo.findByIdAndDelete(id).then(todo => {
        if (todo) {
            return res.status(200).send({todo})
        } else {
            return res.status(404).send()
        }
    }).catch(() => {
        return res.status(400).send()
    })
});

app.listen(port, () => {
    console.log(`Start app on port: ${port}`)
});

module.exports = {
    app
};