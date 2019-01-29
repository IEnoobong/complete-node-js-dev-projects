const {mongoose, Schema} = require('../db/mongoose');

const Todo = mongoose.model('Todo', new Schema({
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
    },
    _createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}));

module.exports = {
    Todo
};