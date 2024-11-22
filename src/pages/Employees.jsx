import React from "react";
import { useFetchEmployeesQuery } from "../store/slices/api/employeesApi";

export default function EmployeesPage() {
  const { data: employees = [], isLoading } = useFetchEmployeesQuery();
  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6 h-full">
      <h1 className="text-2xl font-bold mb-4">Employees</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="p-4 text-left">ID</th>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Section</th>
            <th className="p-4 text-left">Experience</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-100">
              <td className="p-4">{employee.id}</td>
              <td className="p-4">{employee.name}</td>
              <td className="p-4">{employee.section}</td>
              <td className="p-4">{employee.experience}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
