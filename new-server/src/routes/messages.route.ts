import express, { Request, Response, NextFunction } from 'express';
import { createMessage, getMessageByConversationId } from '../controllers/message.controller';

const router = express.Router();

/**
 * ---- Create Message ----
 */
router.post('/message_create', createMessage);

/**
 * ---- Get Message By Conversation ID ----
 */
router.get('/message/:conversationId', getMessageByConversationId);

export default router;