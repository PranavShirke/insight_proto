import { getClient } from './client.js';

export const generateCaptions = async (context, query) => {
    const client = getClient();

    const systemPrompt = `
    You are a Viral Social Media Copywriter.
    Generate 3 distinct caption options for the user's post idea.

    Input Context: ${JSON.stringify(context || {})}

    You MUST return a valid JSON object:
    {
        "captions": [
            {
                "text": "Rainy days = Deep focus mode 🌧️☕ What's your go-to productivity hack? #WorkLife",
                "score": 94,
                "explanation": "Uses a reliable relatability hook + question for engagement."
            },
            {
                "text": "POV: You found the perfect corner. 💻✨",
                "score": 88,
                "explanation": "Short, trendy 'POV' format works well for Reels."
            },
            {
                "text": "Just me, my laptop, and the sound of rain. ⛈️🚀 #Grind",
                "score": 82,
                "explanation": "Minimalist and aesthetic."
            }
        ]
    }
    `;
    const userPrompt = `Generate viral captions for this post description: "${query}"`;

    try {
        const response = await client.models.generateContent({
            model: 'gemma-3-27b-it',
            contents: [
                { role: 'user', parts: [{ text: systemPrompt }] },
                { role: 'user', parts: [{ text: userPrompt }] }
            ]
        });
        const text = response.text;
        const cleanText = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
        return JSON.parse(cleanText);
    } catch (e) {
        console.error("Caption Wizard Error:", e);
        throw new Error("Failed to generate captions");
    }
};
