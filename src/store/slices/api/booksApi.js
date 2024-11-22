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
    }),
    fetchBorrowedBooks: builder.query({
      query: () => "/books/borrowed-books",
    }),

    fetchCurrentBorrowedBooks: builder.query({
      query: () => "/books/current-borrowed-books",
    }),

    fetchUserBorrowHistory: builder.query({
      query: (name) => `/books/borrow-history/${name}`,
    }),

    borrowBook: builder.mutation({
      query: ({ visitorId, bookId, librarianId, borrowDate }) => ({
        url: "/books/borrow",
        method: "POST",
        body: { visitorId, bookId, librarianId, borrowDate },
      }),
    }),

    returnBook: builder.mutation({
      query: ({ recordId, returnDate }) => ({
        url: "/books/return",
        method: "POST",
        body: { recordId, returnDate },
      }),
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
