const { Schema, model } = require('mongoose');

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
module.exports = Message;
