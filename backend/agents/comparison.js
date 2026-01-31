import { getClient } from './client.js';

export const analyzeComparison = async (context, query) => {
    const client = getClient();

    const systemPrompt = `
    You are a Data Benchmarking Analyst.
    Compare the user's current performance against top performers in their niche.

    Input Context: ${JSON.stringify(context || {})}

    You MUST return a valid JSON object:
    {
        "niche": "Tech Education",
        "metrics": [
            { "label": "Engagement Rate", "user": "4.2%", "benchmark": "5.8%", "status": "Underperforming" },
            { "label": "Save Rate", "user": "1.5%", "benchmark": "3.0%", "status": "Critical" },
            { "label": "Consistency", "user": "3 posts/week", "benchmark": "5 posts/week", "status": "Good" },
            { "label": "Story Views", "user": "15%", "benchmark": "10%", "status": "Elite" }
        ],
        "insight": "You are winning on Story loyalty but losing on saveable feed content.",
        "action_plan": "Shift 2 posts per week to 'Saveable Carousels' to boost that 1.5% save rate."
    }
    `;
    const userPrompt = `Compare my stats in the "${query || 'General'}" niche.`;

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
        console.error("Comparison Error:", e);
        throw new Error("Failed to analyze comparison");
    }
};
