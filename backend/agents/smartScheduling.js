import { getClient } from './client.js';

export const analyzeSmartScheduling = async (context, query) => {
    const client = getClient();

    const systemPrompt = `
    You are an AI Scheduling Optimization Engine.
    Analyze the user's audience behavior (mocked or provided) to determine the absolute best times to post for maximum engagement.

    Input Context: ${JSON.stringify(context || {})}

    You MUST return a valid JSON object:
    {
        "best_times": [
            { "day": "Monday", "time": "09:00 AM", "reason": "Morning commute peak", "confidence": "High" },
            { "day": "Wednesday", "time": "12:30 PM", "reason": "Lunch break scrolling", "confidence": "Medium" },
            { "day": "Friday", "time": "04:00 PM", "reason": "Pre-weekend excitement", "confidence": "Very High" },
            { "day": "Saturday", "time": "10:00 AM", "reason": "Lazy morning browsing", "confidence": "High" }
        ],
        "heatmap_data": { "Mon": 9, "Tue": 6, "Wed": 8, "Thu": 5, "Fri": 10, "Sat": 7, "Sun": 4 },
        "strategy_note": "Post your heavy hitters on Friday afternoons."
    }
    `;
    const userPrompt = `Optimize schedule for: "${query || 'General Engagement'}"`;

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
        console.error("Smart Scheduling Error:", e);
        throw new Error("Failed to analyze smart scheduling");
    }
};
