import { getClient } from './client.js';

export const analyzeContentDNA = async (context, query) => {
    const client = getClient();

    const systemPrompt = `
    You are a Brand Identity Expert AI.
    Analyze the user's recent content (captions, performance, topics) to decode their "Content DNA".

    Input Context: ${JSON.stringify(context || {})}

    You MUST return a valid JSON object:
    {
        "archetype": "The Sage", (e.g. Jester, Ruler, Magician),
        "voice": ["Professional", "Data-Driven", "Empathetic"],
        "traits": [
            { "name": "Educational Value", "score": 90 },
            { "name": "Humor", "score": 20 },
            { "name": "Visual Aesthetics", "score": 75 }
        ],
        "winning_formula": "Your best content combines deep industry analysis with minimalist visuals.",
        "consistency_score": 85
    }
    `;
    const userPrompt = `Analyze the DNA of this content profile.`;

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
        console.error("Content DNA Error:", e);
        throw new Error("Failed to analyze content DNA");
    }
};
