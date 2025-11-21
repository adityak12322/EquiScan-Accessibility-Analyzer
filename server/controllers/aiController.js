// server/controllers/aiController.js

import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


// Helper function to safely extract and parse JSON from a string
const safeJsonParse = (text) => {
    try {
        // 1. Check for markdown code blocks (most common AI formatting error)
        let cleanedText = text.trim();
        
        // Agar response ```json या ``` से शुरू होता है, तो उसे हटाओ
        if (cleanedText.startsWith('```')) {
            const endIndex = cleanedText.lastIndexOf('```');
            // '```json' (7 chars) या '```' (3 chars) को हटाओ 
            cleanedText = cleanedText.substring(cleanedText.indexOf('\n') + 1, endIndex !== -1 ? endIndex : undefined).trim();
        }

        // 2. Regex to find the first complete JSON array structure
        const jsonMatch = cleanedText.match(/(\[[\s\S]*\])/); 
        
        if (jsonMatch && jsonMatch[0]) {
            // ✅ DEBUG LOG: Extracted JSON block dikhao
            console.log("Extracted JSON Block (SafeParse):", jsonMatch[0].substring(0, 100) + '...');
            return JSON.parse(jsonMatch[0]);
        }
        console.error("AI response did not contain a recognizable JSON array.");
        return null;
    } catch (e) {
        console.error("Failed to safely parse AI response text (CRITICAL):", e.message);
        return null;
    }
};


export const generateAISuggestions = async (errorsArray, fileName) => {
    // CRITICAL: API key check
    if (!process.env.GEMINI_API_KEY) {
        console.error("AI_INTEGRATION_ERROR: GEMINI_API_KEY is missing. Returning default errors.");
        return errorsArray; 
    }

    if (errorsArray.length === 0) {
        return errorsArray;
    }

    const errorList = errorsArray.map((e, index) => `${index + 1}. Code: ${e.code}, Message: ${e.message}`).join('\n');

    const prompt = `You are an expert WCAG 2.1 consultant. A recent accessibility scan of the document/website "${fileName}" resulted in the following issues. For EACH issue below, provide a professional, concise, and technical 'suggestion' on how to fix it, focusing on web standards (HTML/CSS). 
    
    IMPORTANT: Return ONLY a single JSON array object, with NO surrounding text, conversation, or markdown code blocks (like \`\`\`json). The output must be a pure JSON array. Example format: [{"suggestion": "Use ARIA tags..."}, {"suggestion": "Ensure contrast ratio..."}].

ISSUES:
${errorList}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                // responseMimeType: "application/json" को हटा दिया ताकि AI ज्यादा flexible रहे
                temperature: 0.2,
            }
        });

        // 🛑 CRITICAL LOGGING: Yahan dekho ki AI ne asli mein kya bheja
        console.log("AI RAW RESPONSE:", response.text); 

        const aiSuggestions = safeJsonParse(response.text);

        if (!aiSuggestions || aiSuggestions.length === 0) {
             console.error("AI returned empty or unparsable data after clean-up.");
             return errorsArray; // Original errors wapas bhej do
        }
        
        // Original errors array mein suggestions ko merge karte hain
        return errorsArray.map((error, index) => ({
            ...error,
            suggestion: aiSuggestions[index]?.suggestion || error.suggestion || "AI suggestion is not available.",
        }));

    } catch (error) {
        console.error("AI Suggestion Generation Failed due to API/Network Error:", error);
        // Agar API fail ho jaye, to original errors array wapas bhej do
        return errorsArray;
    }
};