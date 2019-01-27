const {mongoose, Schema} = require('../db/mongoose');

const User = mongoose.model('User', new Schema({
    email: {
        type: String,
        required: true,
        minlength: 5,
        trim: true
    }
}));

module.exports = {
    User
};