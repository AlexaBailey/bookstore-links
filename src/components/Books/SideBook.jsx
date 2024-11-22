import React from "react";

export default function SideBook({ open, book, setOpen }) {
  if (!book) return null;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div
      className={`fixed top-0 right-0 z-50 h-screen w-80 p-6 bg-blue-900 text-white overflow-y-auto shadow-lg transform transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <button
        className="absolute top-4 right-4 text-gray-200 hover:text-white"
        onClick={handleClose}
      >
        ✕
      </button>

      <div className="text-center mb-6">
        <img
          src={book.image}
          alt={book.title}
          className="w-40 mx-auto rounded-lg shadow-lg"
        />
      </div>

      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">{book.title}</h2>
        <p className="text-sm text-gray-300">{book.author}</p>
      </div>

      <div className="flex justify-center items-center my-4">
        <div className="flex items-center">
          <svg
            className="w-5 h-5 text-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.947a1 1 0 00.95.69h4.148c.969 0 1.371 1.24.588 1.81l-3.357 2.44a1 1 0 00-.364 1.118l1.286 3.947c.3.921-.755 1.688-1.538 1.118l-3.357-2.44a1 1 0 00-1.176 0l-3.357 2.44c-.783.57-1.838-.197-1.538-1.118l1.286-3.947a1 1 0 00-.364-1.118L2.171 9.374c-.783-.57-.381-1.81.588-1.81h4.148a1 1 0 00.95-.69l1.286-3.947z" />
          </svg>
          <span className="ml-2">{book.rating}</span>
        </div>
        <span className="mx-4">|</span>
        <span>{book.reviews} Reviews</span>
      </div>

      <div className="flex justify-around text-sm text-gray-300 mb-4">
        <div>
          <p className="font-bold text-white">{book.pages}</p>
          <p>Pages</p>
        </div>
       
      </div>

      <p className="text-sm text-gray-300 leading-relaxed mb-6">
        {book.description}
      </p>

      <button
        className="w-full bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        onClick={() => alert("Read Now!")}
      >
        Read Now
      </button>
    </div>
  );
}
