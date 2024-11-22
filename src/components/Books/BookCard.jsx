import React, { useState } from "react";
import SideBook from "./SideBook";

export default function BookCard({ book }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <SideBook book={book} open={open} setOpen={setOpen} />
      <div
        onClick={() => setOpen(true)}
        key={book.id}
        className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
      >
        <img
          src={book.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz6rOSJMcUox8Gm9tbNe-BoULXlvT3v5E6sA&s"}
          alt={book.title}
          className="rounded-md mb-4 w-full"
        />
        <h3 className="text-sm font-semibold text-gray-800 truncate">
          {book.title}
        </h3>
        <p className="text-xs text-gray-500">{book.author}</p>
      </div>
    </>
  );
}
