import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { getConversations, getMessages, createConversation } from '../controllers/chat.controller.js';

const router = express.Router();

// Auth applied per-route only — NOT globally so socket.io polling is not intercepted
router.get('/conversations', authenticate, getConversations);
router.post('/conversations', authenticate, createConversation);
router.get('/conversations/:conversationId/messages', authenticate, getMessages);

export default router;
