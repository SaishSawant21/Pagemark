import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
	apiKey: process.env.GEMINI_API_KEY,
});

export const generateAIResponse = async (prompt, bookContext) => {

	const response = await ai.models.generateContent({
		model: "gemini-3.5-flash-lite",
		contents: `
You are an AI assistant for PageMark, a personal book tracking application.

Here are the books currently available in the user's PageMark library:

${bookContext}

The user asked:
${prompt}

Instructions:
- Answer the user's question using the PageMark books provided above.
- Do not invent books or information.
- If a requested book is not in the provided library, say that it is not currently in the user's PageMark library.
- Keep the answer concise and useful.
`,
	});

	return response.text;
};