import { Request, Response } from 'express';
import Conversation from '../models/Conversation';

class ConversationController {
    /**
     * ---- Create Conversation ----
     * @param {Request} req 
     * @param {Response} res 
     */
    public async createConversation(req: Request, res: Response) {
        const { senderId, receiverId } = req.body;

        const newConversation = new Conversation({
            members: [senderId, receiverId]
        });

        try {
            const savedConversation = await newConversation.save();
            res.status(201).json(savedConversation);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    /**
     * ---- Get Conversation By User ID ----
     * @param {Request} req 
     * @param {Response} res 
     */
    public async getConversationByUserId(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const conversation = await Conversation.find({
                members: { $in: [userId] }
            });

            if (!conversation) throw res.status(404).json({ message: 'Conversation Not Found!' });
            res.status(200).json(conversation);
        } catch (error) {
            res.status(500).json(error);
        }
    }
}

export default ConversationController;
