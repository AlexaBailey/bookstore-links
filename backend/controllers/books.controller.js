import { readTxtFileAsJson, saveJsonToTxtFile } from "../helpers/convert.js";
export const getBooks = async (req, res) => {
  const { limit = 10, page = 0, category, query = "" } = req.query;

  try {
    const books = await readTxtFileAsJson("books.txt");
    const bookCategories = await readTxtFileAsJson("book_category.txt");
    const categories = await readTxtFileAsJson("categories.txt");

    const categoryMap = categories.reduce((acc, cat) => {
      acc[Number(cat.id)] = cat.name;
      return acc;
    }, {});

    const booksWithCategories = books.map((book) => {
      const bookCategoryIds = bookCategories
        .filter((bc) => Number(bc.book_id) === Number(book.id))
        .map((bc) => Number(bc.category_id));

      const bookCategoryNames = bookCategoryIds.map(
        (categoryId) => categoryMap[categoryId]
      );

      return {
        ...book,
        categories: bookCategoryNames,
      };
    });

    let filteredBooks = booksWithCategories;

    if (category && category !== "All") {
      filteredBooks = filteredBooks.filter((book) =>
        book.categories.includes(category)
      );
    }

    if (query) {
      filteredBooks = filteredBooks.filter((book) =>
        book.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    const startIndex = page * limit;
    const paginatedBooks = filteredBooks.slice(
      startIndex,
      startIndex + parseInt(limit, 10)
    );

    res.status(200).json({
      books: paginatedBooks,
      total: filteredBooks.length,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
};

export const getAllBorrowedBooks = async (req, res) => {
  try {
    const borrowedBooks = await readTxtFileAsJson("borrowed_books.txt");
    const books = await readTxtFileAsJson("books.txt");

    const allBorrowedBooks = borrowedBooks.map((record) => ({
      ...record,
      book: books.find((b) => b.id === record.bookId),
    }));

    res.json(allBorrowedBooks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all borrowed books" });
  }
};
export const borrowBook = async (req, res) => {
  const { visitorId, bookId, librarianId, borrowDate } = req.body;

  try {
    if (!visitorId || !bookId || !librarianId || !borrowDate) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const books = await readTxtFileAsJson("books.txt");
    const bookCategories = await readTxtFileAsJson("book_category.txt");
    const categories = await readTxtFileAsJson("categories.txt");
    const librarians = await readTxtFileAsJson("librarians.txt");
    const librarianSchedules = await readTxtFileAsJson(
      "librarian_schedule.txt"
    );
    const borrowedBooks = await readTxtFileAsJson("borrowed_books.txt");

    const book = books.find((b) => b.id == bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    const bookCategoryIds = bookCategories
      .filter((entry) => entry.book_id == bookId)
      .map((entry) => parseInt(entry.category_id, 10));

    if (!bookCategoryIds.length) {
      return res
        .status(404)
        .json({ message: "No categories found for the book." });
    }

    const bookCategoryNames = categories
      .filter((cat) => bookCategoryIds.includes(parseInt(cat.id, 10)))
      .map((cat) => cat.name);

    if (!bookCategoryNames.length) {
      return res
        .status(404)
        .json({ message: "Book has categories, but their names are missing." });
    }

    const librarian = librarians.find((l) => l.userId == librarianId);
    if (!librarian) {
      return res.status(404).json({ message: "Librarian not found." });
    }

    if (!bookCategoryNames.includes(librarian.section)) {
      return res.status(400).json({
        message: `Librarian's section '${librarian.section}' does not align with the book's categories: ${bookCategoryNames.join(
          ", "
        )}.`,
      });
    }

    const librarianSchedule = librarianSchedules.find(
      (ls) => ls.librarianId == librarian.id
    );
    const borrowDay = new Date(borrowDate).toLocaleString("en-US", {
      weekday: "long",
    });

    if (!librarianSchedule?.schedule.includes(borrowDay)) {
      return res.status(400).json({
        message: `Librarian is not scheduled to work on ${borrowDay}.`,
      });
    }

    if (
      borrowedBooks.some(
        (record) => record.bookId == bookId && !record.returnDate
      )
    ) {
      return res.status(400).json({ message: "Book is already borrowed." });
    }

    borrowedBooks.push({
      id: borrowedBooks.length + 1,
      visitorId,
      bookId,
      librarianId: librarian.id,
      borrowDate,
      returnDate: null,
    });

    await saveJsonToTxtFile("borrowed_books.txt", borrowedBooks);

    res.status(201).json({ message: "Book borrowed successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error borrowing book." });
  }
};

export const returnBook = async (req, res) => {
  const { recordId, returnDate } = req.body;

  try {
    const borrowedBooks = await readTxtFileAsJson("borrowed_books.txt");

    const record = borrowedBooks.find(
      (b) => b.id === recordId && !b.returnDate
    );
    if (!record)
      return res.status(404).json({ message: "Borrow record not found" });

    record.returnDate = returnDate;

    await saveJsonToTxtFile("borrowed_books.txt", borrowedBooks);

    res.status(200).json({ message: "Book returned successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error returning book" });
  }
};

export const getCurrentBorrowedBooks = async (req, res) => {
  try {
    const borrowedBooks = await readTxtFileAsJson("borrowed_books.txt");
    const books = await readTxtFileAsJson("books.txt");

    const currentBorrowed = borrowedBooks
      .filter((record) => !record.returnDate)
      .map((record) => ({
        ...record,
        book: books.find((b) => b.id === record.bookId),
      }));

    res.json(currentBorrowed);
  } catch (error) {
    res.status(500).json({ message: "Error fetching current borrowed books" });
  }
};

export const getVisitorBorrowHistory = async (req, res) => {
  const { name } = req.params;

  try {
    const visitors = await readTxtFileAsJson("visitors.txt");
    const borrowedBooks = await readTxtFileAsJson("borrowed_books.txt");
    const books = await readTxtFileAsJson("books.txt");

    const visitor = visitors.find(
      (v) => v.name.toLowerCase() === name.toLowerCase()
    );
    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found." });
    }

    const visitorId = visitor.id;

    const visitorHistory = borrowedBooks
      .filter((record) => record.visitorId === visitorId)
      .map((record) => ({
        ...record,
        book: books.find((b) => b.id === record.bookId),
      }));

    res.json(visitorHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching visitor borrow history." });
  }
};
