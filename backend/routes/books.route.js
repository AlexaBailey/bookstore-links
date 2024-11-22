import express from "express";
import {
  getBooks,
  borrowBook,
  returnBook,
  getCurrentBorrowedBooks,
  getAllBorrowedBooks,
  getVisitorBorrowHistory,
} from "../controllers/books.controller.js";

const router = express.Router();

router.get("/", getBooks);
router.post("/borrow", borrowBook);
router.post("/return", returnBook);
router.get("/current-borrowed", getCurrentBorrowedBooks);
router.get("/borrow-history/:name", getVisitorBorrowHistory);
router.get("/borrowed-books", getAllBorrowedBooks);

export default router;
