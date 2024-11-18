// Comment Model..
const mongoose = require('mongoose');

// comment Schema...
const commentSchema = mongoose.Schema({
    comment: { type: String, required: false },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
}, {
    timestamps: true
});

// comment Model..
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
