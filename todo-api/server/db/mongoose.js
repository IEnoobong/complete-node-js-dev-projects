const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true});

const Schema = mongoose.Schema;

module.exports = {
    mongoose,
    Schema
};