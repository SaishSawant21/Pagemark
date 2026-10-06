import express from "express";
import {
  getBooks,
  getBook,
  addBook,
  getBookCover,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";

const router = express.Router();

router.get("/", getBooks);
router.post("/", addBook);

router.get("/cover", getBookCover);
router.get("/:id", getBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

export default router;