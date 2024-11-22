import React from "react";
import { useFetchVisitorsQuery } from "../store/slices/api/visitorsApi";

export default function VisitorsPage() {
  const { data: visitors = [], isLoading } = useFetchVisitorsQuery();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Visitors</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="p-4 text-left">ID</th>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Registration Date</th>
          </tr>
        </thead>
        <tbody>
          {visitors.map((visitor) => (
            <tr key={visitor.id} className="hover:bg-gray-100">
              <td className="p-4">{visitor.id}</td>
              <td className="p-4">{visitor.name}</td>
              <td className="p-4">{visitor.registrationDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
