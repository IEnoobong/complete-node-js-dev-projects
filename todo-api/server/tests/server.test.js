const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First todo'
}, {
    _id: new ObjectID(),
    text: 'Second todo'
}];

beforeEach(done => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', done => {
        const text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(201)
            .expect(res => {
                expect(res.body.text).toBeA('string').toBe(text)
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

    it('should return todo doc', done => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done)
    });
});