import mongoose from 'mongoose';

// comment Schema...
const commentSchema = new mongoose.Schema({
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

export default Comment;
