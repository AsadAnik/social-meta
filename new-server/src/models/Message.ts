import { Schema, model } from 'mongoose';

// Schema..
const MessageSchema = new Schema({
    conversationId: {
        type: String
    },
    sender: {
        type: String
    },
    text: {
        type: String
    }
},
{
    timestamps: true
});

// Model..
const Message = model('Message', MessageSchema);
export default Message;
