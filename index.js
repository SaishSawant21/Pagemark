import axios from 'axios';
import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv'

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect();

async function getBooksData(sort) {
	let queryHalfOne = `SELECT books.id, books.title, books.author, books.cover_id,
	book_details.rating, book_details.date_read FROM books  
	INNER JOIN book_details ON books.id = book_details.book_id `
	let queryHalfTwo = "";
	if (sort === 'title') queryHalfTwo = "ORDER BY books.title ASC"
	else if (sort === 'date') queryHalfTwo = "ORDER BY book_details.date_read ASC"
	else if (sort === 'rating') queryHalfTwo = "ORDER BY book_details.rating ASC"
	try {
		const data = await db.query(queryHalfOne + queryHalfTwo);
		return data.rows;
	} catch (error) {
		console.log('Something went wrong', error);
	}
}

async function getSingleBookData(id) {
	return await db.query(`
    SELECT 
      books.id,
      books.title,
      books.author,
      books.cover_id,
      book_details.rating,
      book_details.notes,
      book_details.date_read,
      book_details.genre
    FROM books
    INNER JOIN book_details ON books.id = book_details.book_id
    WHERE books.id = $1
  `, [id]);
}

app.get("/", async (req, res) => {
	const checkSorting = req.query.sort;
	const sortGrp = [
		{ label: "Rating", href: "/?sort=rating", active: checkSorting === "rating" },
		{ label: "Date Read", href: "/?sort=date", active: checkSorting === "date" },
		{ label: "Title A–Z", href: "/?sort=title", active: checkSorting === "title" },
	];
	if (checkSorting) sortGrp.push({ label: "Clear Sort", href: "/" })
	const books = await getBooksData(checkSorting);
	res.render("index.ejs", { books, sortGrp, activeSort: checkSorting, page: 'home' });
});

app.get("/add-book", (req, res) => {
	res.render('addeditbook.ejs', {
		page: 'Add Book',
		edit: false
	});
});

app.get("/edit-book/:id", async (req, res) => {
	const id = req.params.id;
	const bookData = await getSingleBookData(id);
	res.render('addeditbook.ejs', {
		edit: true,
		book: bookData.rows[0],
		page: 'Edit Book'
	});
});

app.post("/edit-book-details/:id", async (req, res) => {
	try {
		const id = req.params.id;
		let { title, author, date_read, genre, rating, cover_id, notes } = req.body;
		cover_id = cover_id || null;
		await db.query(`Update books SET title=$1, author=$2, cover_id=$3 WHERE id=$4`,
			[title, author, cover_id, id]
		);
		await db.query(
			"Update book_details SET date_read=$1, genre=$2, rating=$3, notes=$4 WHERE book_id=$5 ",
			[date_read, genre, rating, notes, id]
		);
		res.redirect('/')

	} catch (error) {
		console.log('Something went wrong', error);
	}
})

app.post("/save-data", async (req, res) => {
	try {
		let { title, author, date_read, genre, rating, cover_id, notes } = req.body;
		cover_id = cover_id || null;
		const bookResult = await db.query("INSERT into books (title, author, cover_id) Values($1,$2,$3) RETURNING id",
			[title, author, cover_id]
		);
		const book_id = bookResult.rows[0].id;
		await db.query(
			"INSERT into book_details (book_id, date_read, genre, rating, notes) Values($1,$2,$3,$4,$5) ",
			[book_id, date_read, genre, rating, notes]
		);
		res.redirect('/')

	} catch (e) {
		// console.log('Something went wrong', e);
	}
})

app.get("/api/cover", async (req, res) => {
	const { title, author } = req.query;
	try {
		const response = await axios.get('https://openlibrary.org/search.json', {
			params: {
				title, author, limit: 1
			},
			headers: {
				"User-Agent": "PageMark/1.0 (personal book tracker)"
			}
		})
		const books = response.data.docs[0];
		if (books && books.cover_i) {
			res.json({ cover_id: books.cover_i });
		} else {
			res.json({ cover_id: null });
		}
	} catch (e) {
		console.log("Something went wrong", e);
	}
})
app.get("/book-detail/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const book = await getSingleBookData(id);
		res.render("bookdetail.ejs", {
			book: book.rows[0], page: 'Book Detail',
		});
	} catch (error) {
		console.log('Something went wrong', error);
	}
});

app.listen(port, () => {
	console.log('Running...');
})