import { getClient } from './client.js';

export const analyzeCompetitorGhost = async (context, query) => {
    const client = getClient();

    const systemPrompt = `
    You are a Competitive Intelligence Agent.
    Analyze the provided competitor (handle/name) to find "Strategy Gaps" the user can exploit.

    Input Context: ${JSON.stringify(context || {})}

    You MUST return a valid JSON object:
    {
        "competitor_profile": {
            "name": "${query || 'Competitor'}",
            "weakness": "High quantity, low engagement depth",
            "strength": "Visual polish"
        },
        "gaps": [
            { "gap": "No community interaction", "opportunity": "Reply to their ignored comments to steal attention." },
            { "gap": "Missing beginner tutorials", "opportunity": "Create the 'Zero to One' guide they lack." },
            { "gap": "Inconsistent posting times", "opportunity": "Own the 9am slot they miss." }
        ],
        "stealable_tactics": [
            "Their 'Day in the Life' hook structure",
            "The way they use carousel swipes"
        ]
    }
    `;
    const userPrompt = `Ghost this competitor: "${query}"`;

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
        console.error("Competitor Ghost Error:", e);
        throw new Error("Failed to analyze competitor ghost");
    }
};
