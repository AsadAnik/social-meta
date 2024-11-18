import express, { Request, Response, NextFunction } from 'express';
import { MessageController } from '../controllers';

const router = express.Router();

// Object instance for MessageController Class..
const messageController = new MessageController();

/**
 * ---- Create Message ----
 */
router.post('/message_create', messageController.createMessage);

/**
 * ---- Get Message By Conversation ID ----
 */
router.get('/message/:conversationId', messageController.getMessageByConversationId);

export default router;