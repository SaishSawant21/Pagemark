import db from "../config/db.js";

export async function getBookDetails(bookId) {
  const result = await db.query(
    `
		SELECT
			book_id,
			rating,
			notes,
			date_read,
			genre
		FROM book_details
		WHERE book_id = $1
		`,
    [bookId]
  );

  return result.rows[0];
}

export async function createBookDetails(
  bookId,
  dateRead,
  genre,
  rating,
  notes
) {
  const result = await db.query(
    `
		INSERT INTO book_details
			(book_id, date_read, genre, rating, notes)
		VALUES
			($1, $2, $3, $4, $5)
		RETURNING *
		`,
    [
      bookId,
      dateRead,
      genre,
      rating,
      notes
    ]
  );

  return result.rows[0];
}