const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const {mongoose, Schema} = require('../db/mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        minlength: 5,
        trim: true,
        unique: true,
        index: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email'])
};

UserSchema.methods.generateAuthToken = function () {
    const user = this;
    const access = 'auth';
    const token = jwt.sign({_id: user._id.toHexString(), access}, 'supersecretmess').toString();

    user.tokens.push({access, token});

    return user.save().then(() => {
        return token;
    });
};

const User = mongoose.model('User', UserSchema);

module.exports = {
    User
};