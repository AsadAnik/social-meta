const router = require('express').Router();
const conversationController = require('../controllers/conversation.controller');
const { createConversation, getConversationByUserId } = conversationController;

/**
 * ---- Create Conversation ----
 */
router.post('/conversation_create', createConversation);

/**
 * ----- Get Conversation By User ID ----
 */
router.get('/conversation/:userId', getConversationByUserId);


module.exports = router;