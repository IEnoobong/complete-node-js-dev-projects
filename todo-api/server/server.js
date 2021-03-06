require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

const {User} = require('./models/users');
const {Todo} = require('./models/todo');
const {authenticate} = require('./middleware/authenticate');

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    const todo = new Todo({
        text: req.body.text,
        _createdBy: req.user._id

    });

    todo.save().then(todo => {
        res.status(201).send({todo})
    }, err => {
        res.status(400).send(err)
    })
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _createdBy: req.user._id
    }).then(todos => {
        res.send({todos})
    }, err => {
        res.status(400).send(err)
    })
});

app.get('/todos/:id', authenticate, (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    Todo.findOne({
        _id: id,
        _createdBy: req.user._id
    }).then(todo => {
        if (todo) {
            res.status(200).send({todo})
        } else {
            res.status(404).send()
        }
    }).catch(() => {
        res.status(400).send()
    });

});

app.delete('/todos/:id', authenticate, (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    Todo.findOneAndDelete({
        _id: id,
        _createdBy: req.user._id
    }).then(todo => {
        if (todo) {
            res.status(200).send({todo})
        } else {
            res.status(404).send()
        }
    }).catch(() => {
        res.status(400).send()
    })
});

app.patch('/todos/:id', authenticate, (req, res) => {
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

    Todo.findOneAndUpdate({
        _id: id,
        _createdBy: req.user._id
    }, {$set: body}, {lean: true, new: true}).then(todo => {
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

app.get('/users/me', authenticate, (req, res) => {
    const user = req.user;
    res.status(200).send({user});
});

app.post('/users/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findByCredentials(email, password)
        .then(user => {
            return user.generateAuthToken().then(token => {
                res.header('X-Auth', token).status(200).send({user})
            })
        })
        .catch(() => {
            res.status(401).send({message: 'Invalid email or password'});
        });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send()
    }).catch(() => {
        res.status(400).send()
    })
});

app.listen(port, () => {
    console.log(`Start app on port: ${port}`)
});

module.exports = {
    app
};