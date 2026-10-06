import * as bookModel from "../models/bookModel.js";
import * as bookDetailsModel from "../models/bookDetailsModel.js";
import axios from "axios";

export const formatBooksForAI = (books) => {
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
};

export const getBooks = async (sort) => {
	return await bookModel.getAllBooks(sort);
};

export const getBook = async (id) => {
	const book = await bookModel.getBookById(id);

	if (!book) {
		return null;
	}

	const details = await bookDetailsModel.getBookDetails(id);

	return {
		...book,
		...details,
	};
};

export const createBook = async (bookData) => {
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

	const details = await bookDetailsModel.createBookDetails(
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
};

export const getBookCover = async (title, author) => {
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
};

export const updateBook = async (id, bookData) => {
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

	const details = await bookDetailsModel.updateBookDetails(
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
};

export const deleteBook = async (id) => {
	const book = await bookModel.getBookById(id);

	if (!book) {
		return null;
	}

	await bookDetailsModel.deleteBookDetails(id);
	await bookModel.deleteBook(id);

	return {
		id,
	};
};