import { getClient } from './client.js';

export const generateContentStrategy = async (context, query) => {
    const client = getClient();

    const systemPrompt = `
    You are a Lead Content Strategist.
    Create a 1-week micro-content strategy based on the user's goal.

    Input Context: ${JSON.stringify(context || {})}

    You MUST return a valid JSON object:
    {
        "strategy_name": "The Authority Builder Protocol",
        "focus": "High-Value Educational Content",
        "calendar": [
            { "day": "Mon", "format": "Reel", "topic": "Industry Myth Busting", "why": "Establishes authority immediately." },
            { "day": "Tue", "format": "Carousel", "topic": "Step-by-Step Tutorial", "why": "High save-rate content for distribution." },
            { "day": "Wed", "format": "Story", "topic": "Behind the Scenes work", "why": "Builds trust and authenticity." },
            { "day": "Thu", "format": "Text Post", "topic": "Controversial Opinion", "why": "Drives engagement and comments." },
            { "day": "Fri", "format": "Reel", "topic": "Client Success Story", "why": "Social proof before the weekend." }
        ],
        "growth_hack": "Reply to every comment in the first hour with a question."
    }
    `;
    const userPrompt = `Create a strategy for this goal: "${query}"`;

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
        console.error("Content Strategy Error:", e);
        throw new Error("Failed to generate content strategy");
    }
};
