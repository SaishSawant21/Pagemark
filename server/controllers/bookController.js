import * as bookService from "../services/bookService.js";


export async function getBooks(req, res) {
  try {
    const books = await bookService.getBooks(
      req.query.sort
    );

    res.json({
      code: 200,
      success: true,
      data: books,
    });

  } catch (error) {
    console.error("Get books error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch books",
    });
  }
}


export async function getBook(req, res) {
  try {
    const book = await bookService.getBook(
      req.params.id
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.json({
      code: 200,
      success: true,
      data: book,
    });

  } catch (error) {
    console.error("Get book error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch book",
    });
  }
}


export async function addBook(req, res) {
  try {
    const book = await bookService.createBook(
      req.body
    );

    res.status(201).json({
      code: 201,
      success: true,
      message: "Book added successfully",
      data: book,
    });

  } catch (error) {
    console.error("Add book error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to add book",
    });
  }
}