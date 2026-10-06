import db from "../config/db.js";

export const getAllBooks = async (sort) => {
	let query = `
    SELECT
      books.id,
      books.title,
      books.author,
      books.cover_id,
      book_details.rating,
      book_details.date_read,
      book_details.genre,
      book_details.notes
    FROM books
    INNER JOIN book_details
      ON books.id = book_details.book_id
  `;

	if (sort === "title") {
		query += ` ORDER BY books.title ASC`;
	} else if (sort === "date") {
		query += ` ORDER BY book_details.date_read ASC`;
	} else if (sort === "rating") {
		query += ` ORDER BY book_details.rating ASC`;
	}

	const result = await db.query(query);

	return result.rows;
};

export const getBookById = async (id) => {
	const result = await db.query(
		`
    SELECT
      id,
      title,
      author,
      cover_id
    FROM books
    WHERE id = $1
    `,
		[id]
	);

	return result.rows[0];
};

export const createBook = async (title, author, coverId) => {
	const result = await db.query(
		`
    INSERT INTO books
      (title, author, cover_id)
    VALUES
      ($1, $2, $3)
    RETURNING id
    `,
		[title, author, coverId]
	);

	return result.rows[0];
};

export const updateBook = async (
	id,
	title,
	author,
	coverId
) => {
	const result = await db.query(
		`
    UPDATE books
    SET
      title = $1,
      author = $2,
      cover_id = $3
    WHERE id = $4
    RETURNING id, title, author, cover_id
    `,
		[
			title,
			author,
			coverId,
			id,
		]
	);

	return result.rows[0];
};

export const deleteBook = async (id) => {
	const result = await db.query(
		`
    DELETE FROM books
    WHERE id = $1
    RETURNING id
    `,
		[id]
	);

	return result.rows[0];
};