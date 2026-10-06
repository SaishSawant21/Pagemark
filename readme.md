# 📖 PageMark

> A full-stack book tracking web app — add books, rate them, write notes, track reading information, and explore your collection with PageMark AI.

**Live Demo** → https://pagemark-client.onrender.com  |  **Author** → [Saish Sawant](https://github.com/SaishSawant21)

---

## ✨ What it does

PageMark is a full-stack CRUD web application inspired by [Derek Sivers' book notes](https://sive.rs/book).

The application currently works as a **shared book collection**. Anyone visiting the site can add, view, edit, and delete books, along with their ratings, genres, reading dates, and notes.

At the moment, PageMark **does not have user authentication or book ownership tracking**. The application does not record which user added or modified a particular book.

It also includes **PageMark AI**, an AI-powered reading companion that can answer questions based on the books currently stored in the collection.

* 📚 Anyone can add books to the collection
* ✏️ Add, edit, view, and delete books
* ⭐ Rate books from 1–5 stars
* 📝 Add and edit notes
* 📅 Track the date a book was read
* 🏷️ Add genres
* 🔎 Search for books using the Open Library API
* 🎨 Preview book covers before saving
* 🔃 Sort books by rating, date read, or title A–Z
* 🤖 Ask **PageMark AI** questions about the collection
* 📖 Ask AI about an individual book
* 💡 Get AI-powered reading suggestions
* 💾 Persist data using PostgreSQL
* 🖼️ Display Open Library book covers
* 📱 Responsive interface
* 🐳 Dockerized frontend and backend
* ☁️ Deployed on Render

---

## 🔄 Project Evolution

PageMark started as a **server-rendered Express application using EJS templates and Tailwind CSS**.

The original version was built to practice full-stack CRUD development with Node.js, Express, PostgreSQL, EJS, Tailwind CSS, and external API integration.

### Original architecture

```text
Express.js
    │
    ├── EJS templates
    ├── Tailwind CSS
    ├── PostgreSQL
    ├── Axios
    └── Open Library API
```

The original application included:

* EJS server-side rendering
* Express routes
* PostgreSQL database
* Tailwind CSS
* Open Library integration
* CRUD operations
* Responsive book shelf

### Current architecture

The application was later **rebuilt and modernized into a separated frontend/backend architecture**.

```text
React + Vite
     │
     │ REST API
     ▼
Express.js
     │
     ├── PostgreSQL
     ├── Open Library API
     └── Gemini API
```

The frontend was migrated from EJS to **React**, with **Vite, Ant Design, React Router, and Axios** introduced for a more interactive client-side experience.

The backend was separated into its own API service and the project was further upgraded with:

* ⚛️ React frontend
* ⚡ Vite
* 🎨 Ant Design
* 🧭 React Router
* 🔌 Axios
* 🧩 Separated frontend and backend
* 🤖 PageMark AI using Gemini
* 🐳 Docker
* 🌐 Nginx
* ☁️ Render deployment

This evolution allowed PageMark to move from a traditional server-rendered application into a modern full-stack application while retaining the original CRUD functionality.

---

## 🔐 Current User Model

PageMark currently **does not implement authentication or user accounts**.

This means:

```text
Visitor
   │
   ├── Add a book
   ├── View books
   ├── Edit a book
   └── Delete a book
```

There is currently no association between a book and the person who added it.

For example, the database does not currently store:

```text
user_id
created_by
updated_by
```

Therefore, the collection is shared among all visitors.

> **Future improvement:** User authentication and book ownership could be introduced in a future version so that each user can maintain a private reading shelf and track their own books.

---

## 🛠️ Tech Stack

| Layer            | Technology                       |
| ---------------- | -------------------------------- |
| Frontend         | React                            |
| Build Tool       | Vite                             |
| UI Library       | Ant Design                       |
| Routing          | React Router                     |
| HTTP Client      | Axios                            |
| Backend          | Node.js + Express.js             |
| Runtime          | Node.js (ES Modules)             |
| Database         | PostgreSQL                       |
| Database Hosting | Supabase                         |
| AI               | Google Gemini API                |
| Book API         | Open Library Search + Covers API |
| Web Server       | Nginx                            |
| Containerization | Docker                           |
| Deployment       | Render                           |

---

## 🤖 PageMark AI

PageMark includes an AI-powered reading companion using the Gemini API.

The AI can answer questions based on the books currently stored in PageMark, including:

* What's in the collection?
* Which books have the highest ratings?
* What should I read next?
* Which genres are in the collection?
* What does the reading history look like?
* Tell me about a specific book

The frontend communicates with the Express backend, which retrieves the relevant book data and sends the request to Gemini.

```text
React Frontend
      │
      │ POST /api/ai/chat
      ▼
Express Backend
      │
      ├── PostgreSQL
      │
      └── Gemini API
```

The Gemini API key is kept on the backend and is never exposed to the frontend.

---

## 🗄️ Database Architecture

PageMark uses two related PostgreSQL tables:

```text
books
────────────────
id (PK)
title
author
cover_id
created_at
       │
       │
       ▼
book_details
────────────────
id (PK)
book_id (FK)
rating
notes
date_read
genre
updated_at
```

The `book_id` foreign key references `books(id)` with cascading deletes.

Only the Open Library `cover_id` is stored in the database. The cover URL is generated dynamically:

```text
https://covers.openlibrary.org/b/id/{cover_id}-M.jpg
```

---

## 🚀 Deployment

PageMark is deployed using Docker containers on Render.

**Frontend:** https://pagemark-client.onrender.com

**Backend:** https://pagemark-server.onrender.com

The frontend communicates with the backend through:

```text
https://pagemark-server.onrender.com/api
```

Sensitive backend configuration such as the PostgreSQL connection string and Gemini API key is stored through Render environment variables rather than committed to the repository.

---

## 📄 License

MIT © 2026 Saish Sawant
