import db from "../config/db.js";

export const getBookDetails = async(bookId)=> {
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

export const createBookDetails = async(
  bookId,
  dateRead,
  genre,
  rating,
  notes
)=> {
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

export async function updateBookDetails(
  bookId,
  dateRead,
  genre,
  rating,
  notes
) {
  const result = await db.query(
    `
		UPDATE book_details
		SET
			date_read = $1,
			genre = $2,
			rating = $3,
			notes = $4,
			updated_at = CURRENT_TIMESTAMP
		WHERE book_id = $5
		RETURNING *
		`,
    [
      dateRead,
      genre,
      rating,
      notes,
      bookId,
    ]
  );

  return result.rows[0];
}

export async function deleteBookDetails(bookId) {
  const result = await db.query(
    `
		DELETE FROM book_details
		WHERE book_id = $1
		RETURNING book_id
		`,
    [bookId]
  );

  return result.rows[0];
}