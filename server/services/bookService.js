import * as bookModel from "../models/bookModel.js";
import * as bookDetailsModel from "../models/bookDetailsModel.js";


export function formatBooksForAI(books) {
  return books
    .map(
      (book) => `
Title: ${book.title}
Author: ${book.author}
Genre: ${book.genre || "Not specified"}
Rating: ${book.rating || "Not rated"}
Date Read: ${book.date_read || "Not specified"}
Notes: ${book.notes || "No notes"}
`
    )
    .join("\n");
}


export async function getBooks(sort) {
  return await bookModel.getAllBooks(sort);
}


export async function getBook(id) {
  const book = await bookModel.getBookById(id);

  if (!book) {
    return null;
  }

  const details = await bookDetailsModel.getBookDetails(id);

  return {
    ...book,
    ...details,
  };
}


export async function createBook(bookData) {
  const {
    title,
    author,
    date_read,
    genre,
    rating,
    cover_id,
    notes,
  } = bookData;

  const book = await bookModel.createBook(
    title,
    author,
    cover_id || null
  );

  const details =
    await bookDetailsModel.createBookDetails(
      book.id,
      date_read || null,
      genre || null,
      rating || null,
      notes || null
    );

  return {
    ...book,
    ...details,
  };
}