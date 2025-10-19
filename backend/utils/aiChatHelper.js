import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import Notes from "../models/Notes.js";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const aiChatWithNotes = async (userId, message) => {
  try {
    const notes = await Notes.find({ user: userId });

    const notesText = notes
      .map(
        (n, idx) =>
          `${idx + 1}. Title: ${n.title}\nSummary: ${n.summary}\nTags: ${n.tags.join(", ")}`
      )
      .join("\n\n");

    const prompt = `
You are an AI assistant that only knows the user's notes.
Answer the user's question using the titles, summaries, and tags.
If the answer is not clearly in the notes, give a best guess based on them.
Do NOT include information outside these notes.

Notes:
${notesText}

User question: ${message}
Respond concisely.
Return only text.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text;

  } catch (error) {
    console.error("AI Chat Helper error:", error);
    return "Sorry, I couldn’t generate a response.";
  }
};

export default aiChatWithNotes;
