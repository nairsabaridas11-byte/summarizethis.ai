import { GoogleGenAI, Type } from "@google/genai";
import { SummaryData } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-3-flash-preview";

export const generateSummary = async (url: string, content: string): Promise<Omit<SummaryData, 'url' | 'timestamp'>> => {
  const prompt = `
    You are a world-class executive assistant. Provide a 'No-Fluff' summary of the following content.
    
    Content from URL (${url}):
    ${content.slice(0, 20000)} // Truncate to avoid token limits if extremely long

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
