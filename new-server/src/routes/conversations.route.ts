import express, { Request, Response, NextFunction } from 'express';
import conversationController from '../controllers/conversation.controller';
import { createConversation, getConversationByUserId } from conversationController;

const router = express.Router();

/**
 * ---- Create Conversation ----
 */
router.post('/conversation_create', createConversation);

/**
 * ----- Get Conversation By User ID ----
 */
router.get('/conversation/:userId', getConversationByUserId);

export default router;