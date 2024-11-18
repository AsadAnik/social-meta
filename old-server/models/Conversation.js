const { Schema, model } = require('mongoose');

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
module.exports = Conversation;
