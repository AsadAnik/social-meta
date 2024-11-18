// Post Model..
const mongoose = require('mongoose');

// posts Schema..
const postSchema = mongoose.Schema({
    image: { type: String, required: false },
    body: { type: String, required: false, maxLength: 2000 },
    ownerId: { type: String, required: false },
    likes: { type: Number, required: false, defaultValue: 0 },
    isLiked: { type: Boolean, required: false, defaultValue: false },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});

// post Model..
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
