import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize the GenAI client using your API key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Generates summary and tags for a note
 * @param {string} title - Note title
 * @param {string} description - Note description
 * @returns {Promise<{summary: string, tags: string[]}>}
 */
const generateSummaryAndTags = async (title, description) => {
  try {
    const prompt = `
      You are an AI note assistant.
      Based on the title and description, generate:
      1. A short summary (max 50 words)
      2. 3-5 relevant tags
      Return ONLY in JSON format:
      {
        "summary": "...",
        "tags": ["...", "..."]
      }

      Title: ${title}
      Description: ${description}
    `;

    // Call Gemini API
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // use a supported model
      contents: prompt,
    });

    // The SDK returns the text in `response.text`
    const text = response.text;

    // Extract JSON from AI response safely
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { summary: "", tags: [] };

    return parsed; // { summary: "...", tags: ["..."] }

  } catch (error) {
    console.error("AI Helper error:", error);
    return { summary: "No summary generated.", tags: [] };
  }
};

export default generateSummaryAndTags;
