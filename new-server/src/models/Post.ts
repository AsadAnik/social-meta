// Post Model..
import { Schema, model, Document } from 'mongoose';

// posts Schema..
const postSchema = new Schema({
    image: { type: String, required: false },
    body: { type: String, required: false, maxLength: 2000 },
    ownerId: { type: String, required: false },
    likes: { type: Number, required: false, default: 0 },
    isLiked: { type: Boolean, required: false, default: false },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    user: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});

// post Model..
const Post = model('Post', postSchema);

export default Post;
