import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useLazyFetchLazyBooksQuery } from "../../store/slices/api/booksApi";
import SideBook from "../Books/SideBook";
import { clearAuthState } from "../../store/slices/auth";
import { useDispatch } from "react-redux";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedRecord,setSelectedRecord] = useState({})
  const [triggerFetchBooks, { data, isFetching }] =
    useLazyFetchLazyBooksQuery();
    const [open,setOpen] = useState(false)
    const dispatch = useDispatch()
const navigate = useNavigate()
  useEffect(() => {
    if (searchQuery.trim()) {
      const debounceTimeout = setTimeout(() => {
        triggerFetchBooks(searchQuery.trim());
      }, 300);

      return () => clearTimeout(debounceTimeout);
    } else {
      setOptions([]);
    }
  }, [searchQuery, triggerFetchBooks]);

  useEffect(() => {
    if (data?.books) {
      setOptions(data.books);
    }
  }, [data]);

  const handleSelectBook = (book) => {
    setOptions([]);
    setSearchQuery("");
    setSelectedRecord(book)
    setOpen(true)
  };

  const logout = () =>{
    dispatch(clearAuthState())
    navigate('/login')
  }

  return (
    <>
     
    <div className="relative bg-white p-4 flex justify-between">
      <form className="max-w-md mx-auto  ">

        <div className="relative">

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search books..."
          />
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
        </div>
      </form>
      <button onClick={logout}>Logout</button>

      {searchQuery && options.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
          {options.map((book) => (
            <div
              key={book.id}
              className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelectBook(book)}
            >
              <img
                src={book.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz6rOSJMcUox8Gm9tbNe-BoULXlvT3v5E6sA&s"}
                alt={book.title}
                className="w-12 h-16 object-cover rounded"
              />
              <div>
                <p className="font-medium text-gray-800">{book.title}</p>
                <p className="text-sm text-gray-500">{book.author}</p>
              </div>
            </div>
          ))}
        </div>
      )}



      {isFetching && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      )}
    </div>
    <SideBook book={selectedRecord} open={open} setOpen={setOpen}/>
    </>

  );
};

export default Navbar;
