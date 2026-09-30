# 📖 PageMark

> A full-stack personal book tracking web app — log books you've read, rate them, write notes, and browse your reading shelf.

**Live Demo** → [pagemark-gn0a.onrender.com](https://pagemark-gn0a.onrender.com) &nbsp;|&nbsp; **Author** → [Saish Sawant](https://github.com/SaishSawant21)

---

## ✨ What it does

PageMark is a full-stack CRUD web application inspired by [Derek Sivers' book notes](https://sive.rs/book). It demonstrates end-to-end software development — from database design and REST API integration to a fully responsive, themed frontend.

- 📚 Browse your personal reading shelf with a responsive book grid
- ⭐ Rate books 1–5 stars with an interactive star picker
- 📝 Write and edit personal notes for every book
- 🎨 Auto-fetch book covers from the Open Library API via AJAX — previewed before saving
- 🔃 Sort books by rating, date read, or title A–Z
- ✏️ Full CRUD — add, view, edit, and delete book entries
- 💾 Data persisted across two related PostgreSQL tables with foreign key constraints
- 🖼️ Skeleton loaders while book covers fetch from Open Library
- 📱 Fully responsive — works on mobile and desktop
- 🚫 Custom 404 page for unknown routes

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Backend | Express.js |
| Database | PostgreSQL (Supabase hosted) |
| Templating | EJS |
| Styling | Tailwind CSS v4 |
| HTTP Client | Axios |
| External API | Open Library Search + Covers API |
| Deployment | Render |

---

## 🏗️ Architecture

The app uses a clean **two-table PostgreSQL schema** to separate book identity from personal reading data:

```
books              book_details
─────────────      ──────────────────────
id (PK)      ←──  book_id (FK)
title              rating
author             notes
cover_id           date_read
created_at         genre
                   updated_at
```

Book covers are never stored in the database — only the Open Library `cover_id` integer is saved. The cover URL is constructed on the fly:
```
https://covers.openlibrary.org/b/id/{cover_id}-M.jpg
```

---

## 📁 Project Structure

```
pagemark/
├── views/
│   ├── partials/
│   │   ├── header.ejs       # Navbar with breadcrumb + context-aware buttons
│   │   └── footer.ejs       # Footer with branding
│   ├── index.ejs            # Home — book shelf grid with sorting
│   ├── bookdetail.ejs       # Book detail — cover, rating, notes, actions
│   ├── addeditbook.ejs      # Shared Add / Edit form
│   └── 404.ejs              # Custom not found page
├── public/
│   ├── style.css            # Tailwind v4 input
│   └── output.css           # Tailwind compiled output (generated)
├── index.js                 # Express server, routes, DB queries
├── .env                     # Environment variables (not committed)
├── .env.example             # Environment variable template
├── .gitignore
└── package.json
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/SaishSawant21/pagemark.git
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

Fill in your values in `.env`:

```env
PORT=3001
DB_USER=your_db_user
DB_HOST=your_db_host
DB_NAME=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=5432
```

Or use a single connection string:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

### 4. Set up the database

Run in psql or pgAdmin:

```sql
CREATE TABLE books (
  id         SERIAL PRIMARY KEY,
  title      VARCHAR(255) NOT NULL,
  author     VARCHAR(255) NOT NULL,
  cover_id   INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

## 🌐 API Integration

**Open Library Search API** — called server-side via Axios when a user adds a book. Returns a `cover_i` field used as the cover ID.

```
GET https://openlibrary.org/search.json?title=Deep+Work&author=Cal+Newport&limit=1
```

**Open Library Covers API** — cover images are built from the stored ID at render time.

```
https://covers.openlibrary.org/b/id/8739161-M.jpg
```

No API key required. Cover fetch failures are handled gracefully — books save successfully with a fallback icon.

---

## 💡 Key Engineering Decisions

- **AJAX cover preview** — cover is fetched and previewed in the browser before the form is submitted, using the native `fetch()` API
- **Two-table schema** — separates immutable book identity (`books`) from mutable reading data (`book_details`), making updates cleaner and queries explicit
- **cover_id over URL** — storing only the integer ID keeps the database lightweight and lets Open Library handle image delivery
- **Shared Add/Edit form** — a single `addeditbook.ejs` template handles both add and edit flows using an `edit` boolean flag passed from the route
- **ES Modules** — the entire backend uses `import/export` syntax (`"type": "module"` in package.json)

---

## 📄 License

MIT © 2026 Saish Sawant
