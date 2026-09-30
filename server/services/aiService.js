import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
	apiKey: process.env.GEMINI_API_KEY,
});

export const generateAIResponse = async (
	prompt,
	bookContext,
	book = null
) => {

	let contents;

	if (book) {

		contents = `
You are an AI assistant for PageMark, a personal book tracking application.

The user is currently viewing this specific book:

Title: ${book.title}
Author: ${book.author}
Rating: ${book.rating || "Not rated"}
Genre: ${book.genre || "Not specified"}
User's Notes:
${book.notes || "No notes added."}

The user asked:
${prompt}

Instructions:
- Answer the user's question specifically about the book provided above.
- Treat "this book" as the book currently being viewed.
- Use the book's title, author, genre, rating, and the user's notes when they are relevant.
- When summarising the user's notes, only use the notes provided above.
- Do not invent or claim that the user's notes contain information that is not provided.
- You may use your general knowledge about the book to answer questions about its ideas, themes, concepts, or content.
- If you are not confident about a specific detail about the book, say so rather than inventing it.
- Keep the answer concise, clear, and useful.
`;

	} else {

		contents = `
You are an AI assistant for PageMark, a personal book tracking application.

Here are the books currently available in the user's PageMark library:

${bookContext}

The user asked:
${prompt}

Instructions:
- Answer the user's question using the PageMark books provided above.
- Do not invent books or information about the user's library.
- If a requested book is not in the provided library, say that it is not currently in the user's PageMark library.
- Keep the answer concise and useful.
`;
	}

	const response = await ai.models.generateContent({
		model: "gemini-3.5-flash-lite",
		contents,
	});

	return response.text;
};