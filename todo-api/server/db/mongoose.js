const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});

const Schema = mongoose.Schema;

module.exports = {
    mongoose,
    Schema
};