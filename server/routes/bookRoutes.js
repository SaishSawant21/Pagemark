import express from "express";
import {
  getBooks,
  getBook,
  addBook,
  getBookCover,
  updateBook,
} from "../controllers/bookController.js";

const router = express.Router();

router.get("/", getBooks);
router.post("/", addBook);

router.get("/cover", getBookCover);
router.get("/:id", getBook);
router.put("/:id", updateBook);

export default router;