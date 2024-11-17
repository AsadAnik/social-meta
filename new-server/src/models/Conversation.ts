import { Schema, model } from 'mongoose';

// Schema..
const ConversationSchema = new Schema({
    members: {
        type: Array
    }
},
{
    timestamps: true
});

// Model..
const Conversation = model('Conversation', ConversationSchema);
export default Conversation;
