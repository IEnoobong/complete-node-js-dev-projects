const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/users');

const todos = [{
    _id: new ObjectID(),
    text: 'First todo'
}, {
    _id: new ObjectID(),
    text: 'Second todo',
    completed: true,
    completedAt: new Date()
}];

beforeEach(done => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos);
    });

    User.deleteMany({}).then(() => done());
});

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
                expect(res.header['x-auth']).toExist();
                expect(res.body.user._id).toBeA('string');
                expect(res.body.user.email).toBeA('string').toBe(payload.email);
            })
            .end(done);

    });
});