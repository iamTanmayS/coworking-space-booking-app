import type { Response } from 'express';
import { Conversation } from '../models/conversation.model.js';
import { Message } from '../models/message.model.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

export const getConversations = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const conversations = await Conversation.find({ 'participants.userId': userId })
            .sort({ updatedAt: -1 })
            .lean();

        res.status(200).json(conversations);
    } catch (error) {
        console.error('getConversations Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { conversationId } = req.params;
        const limit = parseInt(req.query.limit as string) || 50;

        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        // Ensure user is part of the conversation
        const conversation = await Conversation.findOne({
            _id: conversationId as string,
            'participants.userId': userId
        });

        if (!conversation) {
            return res.status(403).json({ error: 'Conversation not found or access denied' });
        }

        const messages = await Message.find({ conversationId: conversationId as string })
            .sort({ createdAt: -1 }) // Newest first
            .limit(limit)
            .lean();

        // Optional: mark messages as read
        await Message.updateMany(
            { conversationId: conversationId as string, senderId: { $ne: userId }, readBy: { $ne: userId } },
            { $addToSet: { readBy: userId } }
        );

        // Reset unread count for the user
        const updateKey = `unreadCounts.${userId}`;
        await Conversation.updateOne(
            { _id: conversationId as string },
            { $set: { [updateKey]: 0 } }
        );

        res.status(200).json(messages);
    } catch (error) {
        console.error('getMessages Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createConversation = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { targetUserId, targetName, targetAvatar, myName, myAvatar } = req.body;

        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        // Check if conversation already exists between these two
        let conversation = await Conversation.findOne({
            $and: [
                { 'participants.userId': userId },
                { 'participants.userId': targetUserId }
            ]
        });

        if (conversation) {
            return res.status(200).json(conversation);
        }

        // Create new
        conversation = await Conversation.create({
            participants: [
                { userId, name: myName || 'Me', avatar: myAvatar },
                { userId: targetUserId, name: targetName || 'User', avatar: targetAvatar }
            ],
            unreadCounts: {
                [userId]: 0,
                [targetUserId]: 0
            }
        });

        res.status(201).json(conversation);
    } catch (error) {
        console.error('createConversation Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
