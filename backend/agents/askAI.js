import { getClient } from './client.js';

export const askAI = async (context, query) => {
    const client = getClient();

    const systemPrompt = `
    You are a Social Media Consultant Chatbot.
    Answer the user's questions about their social media performance, strategy, and content.
    
    You have access to the user's real data in the "Input Context" below. 
    USE THIS DATA to answer specific questions like "Which post performed best?", "Compare Reels vs Carousels", etc.
    
    If the context contains a list of posts, analyze them to find trends, top performers, and engagement stats.
    If the context is empty or missing data for a specific platform, politely inform the user.

    Input Context: ${JSON.stringify(context || {})}
    
    You MUST return a valid JSON object:
    {
        "answer": "Your detailed answer using markdown formatting (bold, lists, etc) based on the data.",
        "follow_up": ["Follow up question 1?", "Follow up question 2?"]
    }
    `;
    const userPrompt = `User Question: "${query}"`;

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
        console.error("Ask AI Error:", e);
        throw new Error("Failed to ask AI");
    }
};
