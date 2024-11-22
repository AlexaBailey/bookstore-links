import React, { useState } from "react";
import ViewRecord from "./ViewRecord";

export default function TableRow({ record, refetch }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  return (
    <>
      {" "}
      <tr
        key={record.id}
        className={`hover:bg-gray-100 cursor-pointer border-l-4  ${
          !record.returnDate && "border-l-red-600"
        }`}
        onClick={() => setSelectedRecord(record) || setIsDialogOpen(true)}
      >
        <td className="p-4">{record.visitorId}</td>
        <td className="p-4">{record.book?.title}</td>
        <td className="p-4">{record.librarianId}</td>
        <td className="p-4">{record.borrowDate}</td>
        <td className="p-4">
          {record.returnDate ? record.returnDate.split("T")[0]  : "Not Returned"}
        </td>
      </tr>
      <ViewRecord
        refetch={refetch}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        selectedRecord={selectedRecord}
      />
    </>
  );
}
