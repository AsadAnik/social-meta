import express, { Request, Response, NextFunction } from 'express';
import { createConversation, getConversationByUserId }  from '../controllers/conversation.controller';

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