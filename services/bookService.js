import pg from "pg";

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

await db.connect();

export function formatBooksForAI(books) {
  return books.map(book => `
Title: ${book.title}
Author: ${book.author}
Genre: ${book.genre || "Not specified"}
Rating: ${book.rating || "Not rated"}
Date Read: ${book.date_read || "Not specified"}
Notes: ${book.notes || "No notes"}
`).join("\n");
}

export async function getBooksData(sort) {
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

  try {
    const data = await db.query(query);
    return data.rows;
  } catch (error) {
    console.log("Something went wrong", error);
  }
}