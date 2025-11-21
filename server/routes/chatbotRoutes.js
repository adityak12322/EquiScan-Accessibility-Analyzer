// server/routes/chatbotRoutes.js

import express from 'express';
import { askChatbot } from '../controllers/chatbotController.js';
import { protect } from '../middleware/authMiddleware.js'; // Security ke liye

const router = express.Router();

// ✅ POST /api/chatbot/ask (Protected route)
router.post('/ask', protect, askChatbot);

export default router;