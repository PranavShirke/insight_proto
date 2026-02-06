import { getClient } from './client.js';

export const analyzeDashboard = async (context, query, stats) => {
    const client = getClient();

    const systemPrompt = `
    You are an expert Social Media Analyst Agent.
    Analyze the provided social media stats and the user's query.

    You MUST return a valid JSON object in the following format:
    {
        "summary": "Brief 1-sentence summary of performance",
        "insights": [
            { "title": "Insight Title", "description": "Insight Details", "sentiment": "positive|neutral|negative" },
            { "title": "Insight Title", "description": "Insight Details", "sentiment": "positive|neutral|negative" }
        ],
        "actionable_tips": [
            "Tip 1",
            "Tip 2",
            "Tip 3"
        ],
        "chart_data": [
            { "name": "Mon", "engagement": 1200, "reach": 3000 },
            { "name": "Tue", "engagement": 1500, "reach": 3500 },
            { "name": "Wed", "engagement": 1100, "reach": 2800 },
            { "name": "Thu", "engagement": 1800, "reach": 4000 },
            { "name": "Fri", "engagement": 2200, "reach": 4500 },
            { "name": "Sat", "engagement": 2500, "reach": 4800 },
            { "name": "Sun", "engagement": 2100, "reach": 4100 }
        ]
    }
    Do not include markdown code blocks. Return raw JSON only.
    Generate realistic "chart_data" (LAST 7 DAYS) based on the stats provided. Simulate a realistic trend.
    `;
    const userPrompt = `
    User Stats: ${JSON.stringify(stats)}
    User Query: "${query || 'General performance analysis'}"
    `;

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
        console.error("Dashboard Agent Error:", e);
        throw new Error("Failed to analyze dashboard");
    }
};
