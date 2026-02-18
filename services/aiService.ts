import { GoogleGenAI, Type } from "@google/genai";
import { SummaryData } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// BUG FIX 8: "gemini-3-flash-preview" does not exist and will cause a 404 from
// the Gemini API on every request. The correct model name for the fast, cheap
// flash model is "gemini-2.0-flash". If you need the stable GA version use
// "gemini-1.5-flash" instead.
const MODEL_NAME = "gemini-2.0-flash";

export const generateSummary = async (url: string, content: string): Promise<Omit<SummaryData, 'url' | 'timestamp'>> => {
  // BUG FIX 9: The original template literal had a JS comment *inside* the
  // string: `${content.slice(0, 20000)} // Truncate to avoid token limits`
  // That comment was being sent verbatim to the AI as part of the prompt text,
  // which is confusing for the model and wastes tokens. The truncation logic is
  // correct — just move the comment outside the template literal.
  const truncatedContent = content.slice(0, 20000); // Truncate to avoid token limits

  const prompt = `
    You are a world-class executive assistant. Provide a 'No-Fluff' summary of the following content.
    
    Content from URL (${url}):
    ${truncatedContent}

    Tone: Sharp, professional, and helpful.
    
    Output strictly in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A concise title of the content" },
            tldr: { type: Type.STRING, description: "Max 2 sentences summarizing the core value" },
            keyInsights: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3-5 punchy bullet points of key insights" 
            },
            nextSteps: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "2 actionable tasks or takeaways" 
            }
          },
          required: ["title", "tldr", "keyInsights", "nextSteps"],
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text);

  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate summary. Please try again.");
  }
};
