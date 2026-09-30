import express from "express";

import {
  getBooks,
  getBook,
  addBook,
} from "../controllers/bookController.js";

const router = express.Router();

router.get("/", getBooks);

router.get("/:id", getBook);

router.post("/", addBook);

export default router;