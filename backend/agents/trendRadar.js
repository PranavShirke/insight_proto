import { getClient } from './client.js';
import googleTrends from 'google-trends-api';

export const analyzeTrends = async (context, query) => {
    const client = getClient();

    // Fetch real trends
    let trendData = "";
    try {
        // Fetch Daily Trends for US (most robust)
        const trendsRes = await googleTrends.dailyTrends({ geo: 'US' });
        const trendsJson = JSON.parse(trendsRes);
        // Extract just the titles to save token space
        const days = trendsJson.default.trendingSearchesDays || [];
        const simpleTrends = days.slice(0, 2).map(day =>
            day.trendingSearches.map(t => ({ title: t.title.query, traffic: t.formattedTraffic }))
        ).flat();
        trendData = JSON.stringify(simpleTrends);
    } catch (e) {
        console.error("Google Trends API Failed", e);
        trendData = "No trend data available";
    }

    const systemPrompt = `
    You are a Trend Spotter AI.
    Analyze the provided Real-Time Google Trends data AND your internal knowledge to identify 4-5 emerging trends relevant to the user's Niche.
    
    User Niche/Interest: "${query || 'General'}"

    You MUST return a valid JSON object:
    {
        "niche": "${query}",
        "trends": [
            { "name": "Trend Name", "growth": "+450%", "category": "Tech", "relevance": "High" },
            { "name": "Trend Name", "growth": "+200%", "category": "Lifestyle", "relevance": "Medium" }
        ],
        "summary": "Brief analysis of why these matter."
    }
    `;
    const userPrompt = `Analyze these trends: ${trendData} for query: ${query}`;

    try {
        const response = await client.models.generateContent({
            model: 'gemma-3-27b-it',
            contents: [
                { role: 'user', parts: [{ text: systemPrompt + "\n\n" + userPrompt }] }
            ]
        });
        const text = response.text;
        const cleanText = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
        const json = JSON.parse(cleanText);

        // Enrich with real trends
        json.realtime_trends = trendData !== "No trend data available" ? [JSON.stringify(trendData).slice(0, 100) + "..."] : [];

        return json;
    } catch (e) {
        console.error(e);
        return { error: "Failed to analyze trends" };
    }
};
