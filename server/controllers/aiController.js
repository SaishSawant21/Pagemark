import { generateAIResponse } from "../services/aiService.js";
import {
	formatBooksForAI,
	getBooks,
} from "../services/bookService.js";

export const chatWithAI = async (req, res) => {
	try {
		const { message, book } = req.body;

		if (!message || !message.trim()) {
			return res.status(400).json({
				success: false,
				message: "Message is required",
			});
		}

		const books = await getBooks();

		const bookContext = formatBooksForAI(books);

		const response = await generateAIResponse(
			message.trim(),
			bookContext,
			book || null
		);

		return res.json({
			success: true,
			data: {
				response,
			},
		});
	} catch (error) {
		console.error("AI controller error:", error);

		return res.status(500).json({
			success: false,
			message: "Unable to generate AI response",
		});
	}
}