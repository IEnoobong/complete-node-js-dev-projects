require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

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

    todo.save().then(todo => {
        res.status(201).send({todo})
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
            res.status(200).send({todo})
        } else {
            res.status(404).send()
        }
    }).catch(() => {
        res.status(400).send()
    });

});

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    Todo.findByIdAndDelete(id).then(todo => {
        if (todo) {
            res.status(200).send({todo})
        } else {
            res.status(404).send()
        }
    }).catch(() => {
        res.status(400).send()
    })
});

app.patch('/todos/:id', (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    const body = _.pick(req.body, ['text', 'completed']);

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {lean: true, new: true}).then(todo => {
        if (todo) {
            res.status(200).send({todo})
        } else {
            res.status(404).send()
        }
    }).catch(() => {
        res.status(400).send()
    })
});

app.post('/users', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);

    const user = new User(body);

    user.save().then(user => {
        return user.generateAuthToken();
    }).then(token => {
        res.header('X-Auth', token).status(201).send({user})
    }).catch(err => {
        res.status(400).send(err)
    })
});

app.listen(port, () => {
    console.log(`Start app on port: ${port}`)
});

module.exports = {
    app
};