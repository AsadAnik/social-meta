import { Request, Response } from 'express';
import Message from '../models/Message';

/**
 * ---- Create Message ----
 * @param {Request} req 
 * @param {Response} res 
 */
const createMessage = async (req: Request, res: Response) => {
    const newMessage = new Message(req.body);

    try {
        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);

    } catch(error) {
        res.status(500).json(error);
    }
};


/**
 * ---- Get Message by Conversation ID ---- 
 * @param {Request} req 
 * @param {Response} res 
 */
const getMessageByConversationId = async (req: Request, res: Response) => {
    try {
        const { conversationId } = req.params;
        const message = await Message.find({
            conversationId: conversationId
        });

        if (!message) throw res.status(404).json({ message: 'Conversation Not Found!' });
        res.status(200).json(message);

    } catch(error) {
        res.status(500).json(error);
    }
};


export { createMessage, getMessageByConversationId };
