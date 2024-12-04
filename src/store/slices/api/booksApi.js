import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const booksApi = createApi({
  reducerPath: "booksApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000" }),
  endpoints: (builder) => ({
    fetchBooks: builder.query({
      query: ({ limit = 10, start = 0, category = "All" }) =>
        `/books?limit=${limit}&page=${start}&category=${category}`,
    }),
    fetchLazyBooks: builder.query({
      query: (searchQuery) => `/books?query=${encodeURIComponent(searchQuery)}`,
      keepUnusedDataFor: 0, // Disable caching
    }),
    fetchBorrowedBooks: builder.query({
      query: () => "/books/borrowed-books",
    }),

    fetchCurrentBorrowedBooks: builder.query({
      query: () => "/books/current-borrowed-books",
    }),

    fetchUserBorrowHistory: builder.query({
      query: (name) => `/books/borrow-history/${name}`,
      providesTags: ["BooksHistory"],
    }),

    borrowBook: builder.mutation({
      query: ({ visitorId, bookId, librarianId, borrow_date }) => ({
        url: "/books/borrow",
        method: "POST",
        body: {
          visitors: { visitorId, tableName: "visitors" },
          book: { bookId, tableName: "books" },
          librarian: { librarianId, tableName: "librarians" },
          borrow_date,
        },
      }),
    }),

    returnBook: builder.mutation({
      query: ({ recordId, returnDate }) => ({
        url: "/books/return",
        method: "POST",
        body: { recordId, tableName: "borrowed_books", returnDate },
      }),
      invalidatesTags: ["BooksHistory"],
    }),
  }),
});

export const {
  useLazyFetchLazyBooksQuery,
  useFetchBooksQuery,
  useFetchBorrowedBooksQuery,
  useFetchCurrentBorrowedBooksQuery,
  useLazyFetchBorrowedBooksQuery,
  useBorrowBookMutation,
  useReturnBookMutation,
  useLazyFetchUserBorrowHistoryQuery,
} = booksApi;
