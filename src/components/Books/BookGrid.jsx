import React, { useEffect, useState } from "react";
import { useFetchBooksQuery } from "../../store/slices/api/booksApi";
import BookCard from "./BookCard";

const BooksGrid = () => {
  const [currentStart, setCurrentStart] = useState(0);
  const [books, setBooks] = useState([]);
  const [direction, setDirection] = useState("down");
  const [isFetching, setIsFetching] = useState(false);

  const { data, isLoading } = useFetchBooksQuery({
    limit: 10,
    start: currentStart/10,
  });

  useEffect(() => {
    if (data?.books?.length) {
      setBooks((prevBooks) => {
        return [...prevBooks, ...data.books];

      });
    }
    setIsFetching(false);
  }, [data, direction]);

  const scrollHandler = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (isLoading || isFetching) return;

    if (scrollHeight - scrollTop - clientHeight < 50) {
      setDirection("down");
      setIsFetching(true);
      setCurrentStart((prevStart) => prevStart + 10);
    }

    if (scrollTop < 50 && currentStart > 0) {
      setDirection("up");
      setIsFetching(true);
      setCurrentStart((prevStart) => (prevStart > 0 ? prevStart - 10 : 0));
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [isFetching, isLoading, currentStart]);

  return (
    <div className="relative min-h-screen bg-gray-100 pb-20">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Books</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard book={book} />
          ))}
        </div>
        {isLoading && <div className="text-center mt-6">Loading...</div>}
      </div>
    </div>
  );
};

export default BooksGrid;
