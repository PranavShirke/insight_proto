import { getClient } from './client.js';

export const generateReport = async (context, query) => {
  const client = getClient();

  const systemPrompt = `
    You are a Professional Social Media Analyst.
    Generate a comprehensive report in Markdown format based on the user's data.

    Structure:
    1. **Executive Summary**: High-level overview.
    2. **Key Metrics Table**: Use Markdown table.
    3. **Visual Analysis**:
       - You MUST include at least 2 charts.
       - To insert a chart, strictly use this format:
         <<<CHART_START
         {
           "type": "bar",
           "data": {
             "labels": ["Mon", "Tue", "Wed", "Thu", "Fri"],
             "datasets": [{ "label": "Engagement", "data": [12, 19, 3, 5, 2] }]
           }
         }
         CHART_END>>>
       - Do NOT try to encode the URL yourself. Just provide the valid JSON inside the tags.
    4. **Strategic Recommendations**: Bullet points.

    Input Context: ${JSON.stringify(context || {})}
    `;
  const userPrompt = `Generate a "${query || 'Executive Summary'}" report.`;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + "\n\n" + userPrompt }] }
      ]
    });
    const text = response.text;

    // Process charts
    const processedText = text.replace(/<<<CHART_START([\s\S]*?)CHART_END>>>/g, (match, jsonString) => {
      try {
        const cleanJson = jsonString.trim();
        const encoded = encodeURIComponent(cleanJson);
        return `![Chart](https://quickchart.io/chart?c=${encoded})`;
      } catch (e) {
        return '> *Error generating chart*';
      }
    });

    return { report: processedText };
  } catch (e) {
    console.error("Report Generator Error:", e);
    throw new Error("Failed to generate report");
  }
};
