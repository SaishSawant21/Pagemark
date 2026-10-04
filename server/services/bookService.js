import * as bookModel from "../models/bookModel.js";
import * as bookDetailsModel from "../models/bookDetailsModel.js";
import axios from 'axios';

export function formatBooksForAI(books) {
  if (!books?.length) {
    return "";
  }

  return books
    .map((book) => {
      return `
Title: ${book.title}
Author: ${book.author}
Genre: ${book.genre || "Not specified"}
Rating: ${book.rating ?? "Not rated"}
Date Read: ${book.date_read || "Not specified"}
PageMark's Notes: ${book.notes || "No notes available"}
			`.trim();
    })
    .join("\n\n");
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

export async function getBookCover(title, author) {
  const response = await axios.get(
    "https://openlibrary.org/search.json",
    {
      params: {
        title,
        author,
        limit: 1,
      },
    }
  );

  const book = response.data.docs?.[0];

  if (!book?.cover_i) {
    return {
      cover_id: null,
    };
  }

  return {
    cover_id: book.cover_i,
  };
}

export async function updateBook(id, bookData) {
  const {
    title,
    author,
    date_read,
    genre,
    rating,
    cover_id,
    notes,
  } = bookData;

  const book = await bookModel.updateBook(
    id,
    title,
    author,
    cover_id || null
  );

  if (!book) {
    return null;
  }

  const details =
    await bookDetailsModel.updateBookDetails(
      id,
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
