import { useState, useEffect } from "react";
import {
  useBorrowBookMutation,
  useLazyFetchLazyBooksQuery,
} from "../../store/slices/api/booksApi";
import { Dialog } from "@headlessui/react";
import { useLazyFetchLazyVisitorsQuery } from "../../store/slices/api/visitorsApi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
const AddRecordDialog = ({ refetch }) => {
  const { user } = useSelector((state) => state.auth);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);

  const [triggerFetchBooks, { data: bookOptions = [] }] =
    useLazyFetchLazyBooksQuery();
  const [triggerFetchVisitors, { data: visitorOptions = [] }] =
    useLazyFetchLazyVisitorsQuery();

  const [newRecord, setNewRecord] = useState({
    visitorId: "",
    bookId: "",
    librarianId: Number(user.id),
    borrow_date: "",
  });

  const [borrowBook] = useBorrowBookMutation();
  const [visitorQuery, setVisitorQuery] = useState("");
  const [bookQuery, setBookQuery] = useState("");

  const resetForm = () => {
    setNewRecord({
      visitorId: "",
      bookId: "",
      librarianId: Number(user.id),
      borrow_date: "",
    });
    setVisitorQuery("");
    setBookQuery("");
  };

  useEffect(() => {
    if (visitorQuery.trim()) {
      const debounceTimeout = setTimeout(() => {
        triggerFetchVisitors(visitorQuery.trim());
      }, 300);

      return () => clearTimeout(debounceTimeout);
    }
  }, [visitorQuery, triggerFetchVisitors]);

  useEffect(() => {
    if (bookQuery.trim()) {
      const debounceTimeout = setTimeout(() => {
        triggerFetchBooks(bookQuery.trim());
      }, 300);

      return () => clearTimeout(debounceTimeout);
    }
  }, [bookQuery, triggerFetchBooks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await borrowBook(newRecord).unwrap();
      toast.success("Record added");
      resetForm();
      setIsFormDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add record");
    }
  };

  return (
    <>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => setIsFormDialogOpen(true)}
      >
        Add New Record
      </button>
      <Dialog
        open={isFormDialogOpen}
        onClose={() => {
          resetForm();
          setIsFormDialogOpen(false);
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md">
            <Dialog.Title className="text-lg font-bold mb-4">
              Add Borrow Record
            </Dialog.Title>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium">Visitor</label>
                <input
                  type="text"
                  value={visitorQuery}
                  onChange={(e) => {
                    const selectedVisitor = visitorOptions.find(
                      (visitor) => visitor.name === e.target.value
                    );
                    setVisitorQuery(e.target.value);
                    setNewRecord({
                      ...newRecord,
                      visitorId: selectedVisitor?.id || "",
                    });
                  }}
                  list="visitor"
                  className="w-full p-2 border rounded"
                  placeholder="Search Visitor..."
                />
                <datalist id="visitor">
                  {visitorOptions.map((visitor) => (
                    <option key={visitor.id} value={visitor.name}>
                      {visitor.name}
                    </option>
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium">Book</label>
                <input
                  type="text"
                  value={bookQuery}
                  onChange={(e) => {
                    const selectedBook = bookOptions.books?.find(
                      (book) => book.title === e.target.value
                    );
                    setBookQuery(e.target.value);
                    setNewRecord({
                      ...newRecord,
                      bookId: selectedBook?.id || "",
                    });
                  }}
                  list="book-options"
                  className="w-full p-2 border rounded"
                  placeholder="Search Book..."
                />
                <datalist id="book-options">
                  {bookOptions.books?.map((book) => (
                    <option key={book.id} value={book.title}>
                      {book.title}
                      {"("}
                      {book.categories
                        ?.map((c, index) => <span key={index}>{c}</span>)
                        .reduce((prev, curr) => [prev, ", ", curr])}
                      {")"}
                    </option>
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium">Borrow Date</label>
                <input
                  type="date"
                  value={newRecord.borrow_date}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, borrow_date: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>

              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default AddRecordDialog;
