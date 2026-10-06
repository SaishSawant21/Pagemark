import * as bookService from "../services/bookService.js";


export const getBooks = async (req, res) => {
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

export const getBook = async (req, res) => {
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


export const addBook = async (req, res) => {
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

export const getBookCover = async (req, res) => {
  try {
    const { title, author } = req.query;

    if (!title || !author) {
      return res.status(400).json({
        success: false,
        message: "Title and author are required",
      });
    }

    const cover = await bookService.getBookCover(
      title,
      author
    );

    res.json({
      success: true,
      data: cover,
    });
  } catch (error) {
    console.error("Get book cover error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch book cover",
    });
  }
}

export const updateBook = async (req, res) => {
  try {
    const book = await bookService.updateBook(
      req.params.id,
      req.body
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.json({
      success: true,
      message: "Book updated successfully",
      data: book,
    });
  } catch (error) {
    console.error("Update book error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update book",
    });
  }
}

export const deleteBook = async (req, res) => {
  try {
    const book = await bookService.deleteBook(
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
      message: "Book deleted successfully",
      data: book,
    });
  } catch (error) {
    console.error("Delete book error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete book",
    });
  }
};

