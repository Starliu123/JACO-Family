import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || ''; // Fallback for safety, though env is expected
const ai = new GoogleGenAI({ apiKey });

export const fetchCreativeStreamData = async (category: string): Promise<{ title: string; username: string }[]> => {
  try {
    const model = 'gemini-3-flash-preview';
    
    const response = await ai.models.generateContent({
      model,
      contents: `Generate 4 creative and catchy live stream titles and usernames for a live streaming app. 
      The category is "${category}". 
      Keep titles short (under 40 chars).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              username: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback data if API fails
    return [
      { title: "Chill Vibes Only 🎵", username: "DJ_Cool" },
      { title: "Late Night Chat 🌙", username: "NightOwl" },
      { title: "Pro Gaming Arena 🎮", username: "GamerPro" },
      { title: "Cooking Masterclass 🍳", username: "ChefMia" }
    ];
  }
};