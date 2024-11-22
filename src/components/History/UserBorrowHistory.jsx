const BorrowTable = ({ data, onRowClick }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="p-4 text-left">Visitor</th>
            <th className="p-4 text-left">Book</th>
            <th className="p-4 text-left">Librarian</th>
            <th className="p-4 text-left">Borrow Date</th>
            <th className="p-4 text-left">Return Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((record) => (
            <tr
              key={record.id}
              className={`hover:bg-gray-100 cursor-pointer border-l-4 ${
                !record.returnDate && "border-l-red-600"
              }`}
              onClick={() => onRowClick(record)}
            >
              <td className="p-4">{record.visitorId}</td>
              <td className="p-4">{record.book?.title}</td>
              <td className="p-4">{record.librarianId}</td>
              <td className="p-4">{record.borrowDate}</td>
              <td className="p-4">
                {record.returnDate ? record.returnDate : "Not Returned"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
