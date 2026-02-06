import { getClient } from './client.js';

export const analyzeViralPotential = async (context, query) => {
    const client = getClient();
    // const model = client.getGenerativeModel({ model: "gemma-3-27b-it" }); // Removed in favor of direct client.models call

    const systemPrompt = `
    You are a Viral Content Predictor AI.
    Analyze the user's uploaded content context or previous top posts to predict virality.
    
    Input Context: ${JSON.stringify(context || {})}
    
    You MUST return a valid JSON object:
    {
        "score": 85, (0-100 integer),
        "prediction": "High potential for virality due to...",
        "retention_est": "45s",
        "improvement_tips": ["Tip 1", "Tip 2"],
        "factors": [
            { "name": "Hook", "score": 90, "comment": "Strong visual hook" },
            { "name": "Pacing", "score": 70, "comment": "Could be faster" },
            { "name": "Audio", "score": 80, "comment": "Trending audio detected" }
        ]
    }
    `;

    const userPrompt = `Analyze this content idea/thumbnail context: ${query}`;

    try {
        const response = await client.models.generateContent({
            model: 'gemma-3-27b-it',
            contents: [
                { role: 'user', parts: [{ text: systemPrompt + "\n\n" + userPrompt }] }
            ]
        });
        const text = response.text;
        const cleanText = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
        return JSON.parse(cleanText);
    } catch (e) {
        console.error("Viral Predictor Error:", e);
        throw new Error("Failed to analyze viral potential");
    }
};
