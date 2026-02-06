import { getClient } from './client.js';

export const analyzeAudienceClone = async (context, query) => {
    const client = getClient();

    const systemPrompt = `
    You are an Audience Intelligence Expert.
    Analyze the user's content to identify their ideal "Superfans" or "Cloned Audience".

    Input Context: ${JSON.stringify(context || {})}

    You MUST return a valid JSON object:
    {
        "top_persona": "The Aspiring Solopreneur",
        "demographics": {
            "age": "25-34",
            "gender": "60% Male, 40% Female",
            "location": "Top Tier Cities",
            "active_hours": "8pm - 11pm"
        },
        "psychographics": [
            "Values freedom and autonomy",
            "Struggles with consistency",
            "Loves productivity hacks"
        ],
        "content_preferences": [
            { "type": "Tutorials", "score": 90 },
            { "type": "Case Studies", "score": 75 },
            { "type": "Motivation", "score": 60 }
        ]
    }
    `;
    const userPrompt = `Generate the deep audience clone profile for this creator.`;

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
        console.error("Audience Clone Error:", e);
        throw new Error("Failed to analyze audience clone");
    }
};
