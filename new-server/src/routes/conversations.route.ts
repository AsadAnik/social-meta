import express, { Request, Response, NextFunction } from 'express';
import { ConversationController } from '../controllers';

const router = express.Router();

// Object instance for ConversationController Class..
const conversationController = new ConversationController();

/**
 * ---- Create Conversation ----
 */
router.post('/conversation_create', conversationController.createConversation);

/**
 * ---- Get Conversation By User ID ----
 */
router.get('/conversation/:userId', conversationController.getConversationByUserId);

export default router;