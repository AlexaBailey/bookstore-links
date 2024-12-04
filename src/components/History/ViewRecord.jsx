import React from "react";
import { useReturnBookMutation } from "../../store/slices/api/booksApi";
import { Dialog } from "@headlessui/react";
import { toast } from "react-toastify";

export default function ViewRecord({
  isDialogOpen,
  setIsDialogOpen,
  selectedRecord,
  refetch,
}) {
  const [returnBook] = useReturnBookMutation();
  const handleMarkAsReturned = async (recordId) => {
    try {
      await returnBook({
        recordId,
        returnDate: new Date().toISOString().split("T")[0],
      });
      toast.success("Book marked as returned!");
      refetch();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to mark book as returned.");
    }
  };
  if (!isDialogOpen) return null;
  return (
    <Dialog
      open={isDialogOpen}
      onClose={() => setIsDialogOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md">
          {selectedRecord && (
            <>
              <Dialog.Title className="text-lg font-bold mb-4">
                Book Details
              </Dialog.Title>
              <div className="mb-4">
                <p>
                  <strong>Visitor:</strong> {selectedRecord.visitor.name}
                </p>
                <p>
                  <strong>Book:</strong> {selectedRecord.book?.title}
                </p>
                <p>
                  <strong>Librarian:</strong> {selectedRecord.librarian.name}
                </p>
                <p>
                  <strong>Borrow Date:</strong> {selectedRecord.borrow_date}
                </p>
                <p>
                  <strong>Return Date:</strong>{" "}
                  {selectedRecord.returnDate || "Not Returned"}
                </p>
              </div>
            </>
          )}
          {!selectedRecord.returnDate && (
            <button
              onClick={() => {
                handleMarkAsReturned(selectedRecord.id);
                setIsDialogOpen(false);
                refetch();
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
            >
              Mark as Returned
            </button>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
