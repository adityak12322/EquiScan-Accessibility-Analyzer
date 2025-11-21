// server/controllers/chatbotController.js

import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config();

// FIX: Initialize the AI client with the key from .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ✅ SYSTEM PROMPT: Chatbot ka persona define karta hai
const systemInstruction = `You are EquiScan, a helpful and highly knowledgeable AI assistant specializing in Web Accessibility (WCAG 2.1 Level AA) and Document Quality (ATS). You also have expertise in the MERN stack (Node.js, React, MongoDB, Express) used to build this application. Answer user questions clearly and concisely. If asked about the project's stack, be helpful and encouraging.`;

export const askChatbot = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ message: "Message is required." });
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: message }] }],
            config: {
                systemInstruction: systemInstruction, // Chatbot ko uska context deta hai
                // Low temperature for factual, reliable answers
                temperature: 0.2, 
            }
        });

        const textResponse = response.text || "Sorry, I couldn't process that request.";

        res.json({ answer: textResponse });
    } catch (error) {
        console.error("Chatbot API Error:", error);
        // User ko server error message dena
        res.status(500).json({ message: "Failed to connect to AI service." });
    }
};