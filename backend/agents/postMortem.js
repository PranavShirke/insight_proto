import { getClient } from './client.js';

export const analyzePostMortem = async (context, query) => {
    const client = getClient();

    const systemPrompt = `
    You are a Social Media Content Doctor.
    Analyze the provided post context to determine why it underperformed(or how to improve it).

    Input Context: ${JSON.stringify(context || {})}

    You MUST return a valid JSON object:
{
    "diagnosis": "The hook was too slow and visual lighting was poor.",
        "score": 45,
            "autopsy_report": [
                { "issue": "Hook retention", "severity": "Critical", "fix": "Cut the first 3 seconds of the intro." },
                { "issue": "Hashtag irrelevance", "severity": "Moderate", "fix": "Replace generic #fun with niche tags." },
                { "issue": "Call to Action", "severity": "Low", "fix": "Add a clear question at the end." }
            ],
                "revived_version": "Use this hook instead: 'Stop making this mistake...'"
}
`;
    const userPrompt = `Perform a post - mortem analysis on: ${query} `;

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
        console.error("Post Mortem Error:", e);
        throw new Error("Failed to analyze post mortem");
    }
};
