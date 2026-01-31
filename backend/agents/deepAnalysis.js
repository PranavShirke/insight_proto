import { getClient } from './client.js';

export const runDeepAnalysis = async (platform, url, postData) => {
    const client = getClient();

    let contents = [];

    if (platform === 'youtube') {
        contents.push({
            fileData: {
                fileUri: url,
                mimeType: "video/mp4"
            }
        });
    } else {
        // For Instagram/Facebook, we can't pass the URL as fileData to Gemini directly.
        // Instead, we pass the metadata/caption we have.
        contents.push({ text: `Analyze this content based on the provided metadata. Platform: ${platform}, URL: ${url}, Post Metadata: ${JSON.stringify(postData)}` });
    }

    contents.push({
        text: `
        Analyze the content described above in extreme detail (based on available metadata/caption/metrics). 
        Identify patterns based on engagement metrics provided.
        Identify:
        1. Estimated performance quality based on likes/comments ratio.
        2. Sentiment analysis of the caption/text.
        3. Key strengths and weaknesses based on available data.
        4. Provide a theoretical "Retention Score" based on content type and engagement.

        Return ONLY a valid JSON object:
        {
            "overall_score": 88,
            "metrics": {
                "avg_watch_time": "Estimated",
                "skip_rate": "Estimated",
                "completion_rate": "Estimated"
            },
            "timeline_events": [
                { "time": "00:00", "event": "Overview", "type": "neutral", "desc": "Based on metadata analysis." }
            ],
            "retention_graph": [
                { "second": 0, "score": 100 },
                { "second": 5, "score": 90 }
            ],
            "summary": "Detailed analysis of the post performance..."
        }
    `});

    try {
        const response = await client.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [
                { role: 'user', parts: contents }
            ]
        });
        const text = response.text;
        const cleanText = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
        return JSON.parse(cleanText);
    } catch (e) {
        console.error("Deep Analysis Error:", e);
        throw new Error("Failed to run deep analysis");
    }
};
