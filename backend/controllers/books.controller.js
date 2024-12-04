import { readTxtFileAsJson, saveJsonToTxtFile } from "../helpers/convert.js";
import Link from "../helpers/Link.class.js";

export const getBooks = async (req, res) => {
  const { limit = 10, page = 0, category, query = "" } = req.query;

  try {
    const bookCategories = await readTxtFileAsJson("book_category.txt");

    const booksWithCategories = await Promise.all(
      bookCategories.map(async (entry) => {
        const book = await new Link(entry.book_id).resolveLink();
        const category = await new Link(entry.category_id).resolveLink();

        return {
          ...book,
          categories: [category.name],
        };
      })
    );

    let filteredBooks = booksWithCategories;

    if (category && category !== "All") {
      filteredBooks = filteredBooks.filter((book) =>
        book.categories.includes(category)
      );
    }

    if (query) {
      filteredBooks = filteredBooks.filter(
        (book) =>
          typeof book.title === "string" &&
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
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Error fetching books" });
  }
};

export const getAllBorrowedBooks = async (req, res) => {
  try {
    const borrowedBooks = await readTxtFileAsJson("borrowed_books.txt");

    const allBorrowedBooks = await Promise.all(
      borrowedBooks.map(async (record) => ({
        ...record,
        book: await new Link(record.book).resolveLink(),
        visitor: await new Link(record.visitor).resolveLink(),
        librarian: await new Link(record.librarian).resolveLink(),
      }))
    );

    res.json(allBorrowedBooks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all borrowed books" });
  }
};

export const borrowBook = async (req, res) => {
  const {
    visitors: { visitorId, tableName: visitorTableName },
    book: { bookId, tableName: bookTableName },
    librarian: { librarianId, tableName: librarianTableName } = {},
    borrow_date,
  } = req.body;

  try {
    if (!visitorId || !bookId || !librarianId || !borrow_date) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const visitorLink = await Link.formatLinkById(visitorTableName, visitorId);
    const bookLink = await Link.formatLinkById(bookTableName, bookId);
    const librarianLink = await Link.formatLinkById(
      librarianTableName,
      librarianId
    );

    const bookCategories = await readTxtFileAsJson("book_category.txt");

    const categoryLinks = bookCategories
      .filter((bc) => bc.book_id === bookLink)
      .map((bc) => bc.category_id);

    const categories = await Promise.all(
      categoryLinks.map(async (categoryLink) => {
        const category = await new Link(categoryLink).resolveLink();
        return category.name;
      })
    );

    const librarian = await new Link(librarianLink).resolveLink();

    if (!categories.includes(librarian.section)) {
      return res.status(400).json({
        message: `Librarian's section (${librarian.section}) does not match the book's category (${categories.join(
          ", "
        )}).`,
      });
    }

    const librarianSchedules = await readTxtFileAsJson(
      "librarian_schedule.txt"
    );
    const librarianScheduleEntry = librarianSchedules.find(
      (ls) => ls.librarianId === librarianLink
    );

    if (!librarianScheduleEntry) {
      return res.status(400).json({ message: "Librarian schedule not found." });
    }

    const borrowDay = new Date(borrow_date).toLocaleString("en-US", {
      weekday: "long",
    });

    if (!librarianScheduleEntry?.schedule.includes(borrowDay)) {
      return res.status(400).json({
        message: `Librarian is not scheduled to work on ${borrowDay}.`,
      });
    }
    const borrowedBooks = await readTxtFileAsJson("borrowed_books.txt");
    if (
      borrowedBooks.some(
        (record) => record.book === bookLink && !record.return_date
      )
    ) {
      return res.status(400).json({ message: "Book is already borrowed." });
    }

    borrowedBooks.push({
      id: borrowedBooks.length + 1,
      visitor: visitorLink,
      book: bookLink,
      librarian: librarianLink,
      borrow_date,
      return_date: null,
    });

    await saveJsonToTxtFile("borrowed_books.txt", borrowedBooks);

    res.status(201).json({ message: "Book borrowed successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error borrowing book.", error: error.message });
  }
};

export const returnBook = async (req, res) => {
  const { recordId, returnDate, tableName = "borrowed_books" } = req.body;

  try {
    const borrowedBooks = await readTxtFileAsJson(`${tableName}.txt`);

    const record = borrowedBooks.find((entry) => entry.id === recordId);
    if (!record) {
      return res.status(404).json({ message: "Borrow record not found." });
    }

    record.return_date = returnDate;

    await saveJsonToTxtFile(`${tableName}.txt`, borrowedBooks);

    res.status(200).json({ message: "Book returned successfully.", record });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error returning book.", error: error.message });
  }
};

export const getCurrentBorrowedBooks = async (req, res) => {
  try {
    const borrowedBooks = await readTxtFileAsJson("borrowed_books.txt");

    const currentBorrowed = await Promise.all(
      borrowedBooks
        .filter((record) => !record.return_date)
        .map(async (record) => ({
          ...record,
          book: await new Link(record.book).resolveLink(),
          visitor: await new Link(record.visitor).resolveLink(),
          librarian: await new Link(record.librarian).resolveLink(),
        }))
    );

    res.json(currentBorrowed);
  } catch (error) {
    res.status(500).json({ message: "Error fetching current borrowed books" });
  }
};

export const getVisitorBorrowHistory = async (req, res) => {
  const { name } = req.params;

  try {
    const visitors = await readTxtFileAsJson("visitors.txt");
    const visitor = visitors.find((v) => v.name == name);

    const visitorLink = await Link.formatLinkById("visitors", visitor.id);

    const borrowedBooks = await readTxtFileAsJson("borrowed_books.txt");
    const visitorHistory = await Promise.all(
      borrowedBooks.map(async (record) => {
        if (record.visitor !== visitorLink) return null;

        const book = await new Link(record.book).resolveLink();
        const librarian = await new Link(record.librarian).resolveLink();

        return {
          ...record,
          visitor,
          book,
          librarian,
        };
      })
    );

    const filteredHistory = visitorHistory.filter((record) => record !== null);

    res.json(filteredHistory);
  } catch (error) {
    res.status(500).json({ message: "Error fetching visitor borrow history." });
  }
};
