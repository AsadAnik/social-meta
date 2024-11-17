import express, { Request, Response, NextFunction } from 'express';
import messageController from '../controllers/message.controller';
import { createMessage, getMessageByConversationId } from messageController;

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