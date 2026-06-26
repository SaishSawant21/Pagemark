# 📖 PageMark

A personal book tracking web app to log books you've read, rate them, take notes, and browse your reading shelf — inspired by [Derek Sivers' book notes](https://sive.rs/book).

---

## 🚀 Features

- 📚 Browse your personal reading shelf
- ⭐ Rate books from 1 to 5 stars
- 📝 Add personal notes for each book
- 🎨 Auto-fetch book covers from Open Library API
- 🔃 Sort books by rating, date read, or title
- ✏️ Edit and delete book entries
- 💾 Data persisted in a PostgreSQL database

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Templating | EJS |
| Database | PostgreSQL |
| Styling | Tailwind CSS v4 |
| HTTP Client | Axios |
| External API | [Open Library Covers API](https://openlibrary.org/dev/docs/api) |

---

## 📁 Project Structure
pagemark/

├── views/

│   ├── partials/

│   │   ├── header.ejs

│   │   └── footer.ejs

│   ├── index.ejs        # Home / book shelf

│   ├── bookdetail.ejs   # Book detail page

│   └── form.ejs         # Add / Edit book form

├── public/

│   ├── style.css        # Tailwind input

│   └── output.css       # Tailwind output (generated)

├── index.js             # Express server & routes

├── .env                 # Environment variables (not committed)

├── .env.example         # Environment variable template

├── .gitignore

└── package.json
---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/pagemark.git
cd pagemark
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Then fill in your values in `.env`:
PORT=3001

DB_USER=db_username

DB_HOST=hostname

DB_NAME=DB Name

DB_PASSWORD=yourpassword

DB_PORT=5432

### 4. Set up the database

Run the following SQL in psql or pgAdmin:

```sql
CREATE TABLE books (
  id         SERIAL PRIMARY KEY,
  title      VARCHAR(255) NOT NULL,
  author     VARCHAR(255) NOT NULL,
  cover_id   INTEGER,
);

CREATE TABLE book_details (
  id         SERIAL PRIMARY KEY,
  book_id    INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  rating     INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes      TEXT,
  date_read  DATE,
  genre      VARCHAR(100),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Start Tailwind CSS watcher

```bash
npx @tailwindcss/cli -i ./public/style.css -o ./public/output.css --watch
```

### 6. Start the server

```bash
nodemon index.js
```

Visit [http://localhost:3001](http://localhost:3001)

---

## 🌐 API Used

**Open Library Search API** — used to fetch book cover IDs when adding a book.

GET https://openlibrary.org/search.json?title=Deep+Work&author=Cal+Newport&limit=1

**Open Library Covers API** — used to display book cover images.
https://covers.openlibrary.org/b/id/{cover_id}-M.jpg

No API key required.

---

## 📄 License

MIT

---

## 👤 Author

**Saish Sawant**