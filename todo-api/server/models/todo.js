const {mongoose} = require('../db/mongoose');

const Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 5,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date,
        default: null
    }
});

module.exports = {
    Todo
};