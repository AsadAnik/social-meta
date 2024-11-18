const router = require('express').Router();
const messageController = require('../controllers/message.controller');
const { createMessage, getMessageByConversationId } = messageController;


/**
 * ---- Create Message ----
 */
router.post('/message_create', createMessage);

/**
 * ---- Get Message By Conversation ID ----
 */
router.get('/message/:conversationId', getMessageByConversationId);


module.exports = router;