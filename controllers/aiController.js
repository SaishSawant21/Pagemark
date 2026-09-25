import { generateAIResponse } from "../services/aiService.js";
import { formatBooksForAI, getBooksData } from "../services/bookService.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const books = await getBooksData();

    const bookContext = formatBooksForAI(books);

    console.log(bookContext);

    const response = await generateAIResponse(message, bookContext);


    res.json({
      response,
    });

  } catch (error) {
    console.error("AI controller error:", error);

    res.status(500).json({
      error: "Unable to generate AI response",
    });
  }
};