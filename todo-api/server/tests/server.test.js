const expect = require('expect');
const request = require('supertest');
const _ = require("lodash");
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/users');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', done => {
        const text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(201)
            .expect(res => {
                expect(res.body.todo.text).toBeA('string').toBe(text)
            })
            .end((err) => {
                if (err) {
                    return done(err)
                }
                Todo.find({text}).then(todos => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch(reason => done(reason));
            })
    });

    it('should not create todo with invalid body data', done => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end(err => {
                if (err) {
                    return done(err)
                }
                Todo.find().then(todos => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(reason => done(reason));
            })
    });
});

describe('GET /todos', () => {
    it('should get all todos', done => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(done);

    });

    it('should return 404 for non-object ids', done => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .expect(res => {
                expect(res.text).toBeFalsy()
            })
            .end(done)

    });

    it('should return 404 if todo not found', done => {
        request(app)
            .get(`/todo/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done)
    });

    it('should return a todo doc', done => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done)
    });
});

describe('DELETE /todo/:id', () => {
    it('should return 404 for non-object ids', done => {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .expect(res => {
                expect(res.text).toBeFalsy()
            })
            .end(done)
    });

    it('should return 404 if todo not found', done => {
        request(app)
            .delete(`/todo/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done)
    });

    it('should remove a todo doc', done => {
        const id = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(id);
            })
            .end(err => {
                if (err) {
                    return done(err)
                }
                Todo.findById(id).then(todo => {
                    expect(todo).toNotExist();
                    done();
                }).catch(() => done())
            })
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', done => {
        const id = todos[0]._id.toHexString();
        const body = {
            text: "Oo happy day!",
            completed: true
        };

        request(app)
            .patch(`/todos/${id}`)
            .send(body)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBeA('string').toBe(body.text);
                expect(res.body.todo.completed).toBeA('boolean').toBe(true);
                expect(res.body.todo.completedAt).toBeA('string');
            })
            .end(done);
    });

    it('should clear completed at when todo is not completed', done => {
        const id = todos[1]._id.toHexString();
        const body = {
            text: "Oo happy day!",
            completed: false
        };

        request(app)
            .patch(`/todos/${id}`)
            .send(body)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBeA('string').toBe(body.text);
                expect(res.body.todo.completed).toBeA('boolean').toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create new user', done => {
        const payload = {email: 'ibanga@yahoo.com', password: 'yagaba'};

        request(app)
            .post('/users')
            .send(payload)
            .expect(201)
            .expect(res => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body.user._id).toExist().toBeA('string');
                expect(res.body.user.email).toBeA('string').toBe(payload.email);
            })
            .end(err => {
                if (err) {
                    return done(err);
                }

                User.findOne({email: payload.email}).then(user => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(payload.password);
                    done();
                }).catch(err => done(err));
            });

    });

    it('should return validation error if request invalid', done => {
        request(app)
            .post('/users')
            .expect(400)
            .expect(res => {
                expect(res.body).toExist();
            })
            .end(done)
    });

    it('should not create user if email has been taken', done => {
        request(app)
            .post('/users')
            .send({email: users[0].email, password: 'udembali'})
            .expect(400)
            .expect(res => {
                expect(res.body).toExist();
            })
            .end(done)
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', done => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.user._id).toBeA('string').toBe(users[0]._id.toHexString());
                expect(res.body.user.email).toBeA('string').toBe(users[0].email);
            })
            .end(done)
    });

    it('should return 401 if not authenticated', done => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect(res => {
                expect(res.body).toEqual({})
            })
            .end(done)

    });
});

describe('POST /users/login', () => {
    it('should return x-auth when valid user logs in', done => {
        const payload = _.pick(users[1], ['email', 'password']);

        request(app)
            .post('/users/login')
            .send(payload)
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body.user.email).toBeA('string').toBe(payload.email);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[1]._id).then(user => {
                    expect(user.tokens[0]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch(err => done(err));
            });
    });

    it('should return 401 when invalid user logs in', done => {
        const payload = {email: 'ibanga@yahoo.com', password: 'yagaba'};

        request(app)
            .post('/users/login')
            .send(payload)
            .expect(401)
            .expect(res => {
                expect(res.headers['x-auth']).toNotExist();
                expect(res.body.message).toBeA('string').toBe('Invalid email or password');
            })
            .end(done);
    });
});

describe('DELETE /users/me/token', () => {
    it('should remove token on logout', done => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err) => {
                if (err) {
                    return done(err)
                }

                User.findById(users[0]._id).then(user => {
                    expect(user.tokens.length).toBe(0);
                    done()
                }).catch(err => done(err))
            })
    });
});