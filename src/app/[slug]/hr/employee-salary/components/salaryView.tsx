"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  useFetchEmployesQuery,
  useDeleteEmployeMutation,
} from "@/slices/employe/employe";
import "react-toastify/dist/ReactToastify.css";
import { FaEnvelope } from "react-icons/fa";
import { useFetchSelectedCompanyQuery } from "@/slices/auth/authApi";


const SalaryView: React.FC = () => {
  const router = useRouter();
  const { data: employeesData, error, isLoading } = useFetchEmployesQuery();
  const [deleteEmployee] = useDeleteEmployeMutation();
  const {currentData} = useFetchSelectedCompanyQuery();

  const employees: Employee[] = employeesData?.employees ?? [];

  console.log('employees....', employees);


  const navigateTo = (path: string, message: string) => {
    if (!path) {
      toast.error(message);
      return;
    }
    router.push(path);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await deleteEmployee(id).unwrap();
      toast.success("Employee deleted successfully!");
    } catch (err) {
      const errorMessage =
        err && typeof err === "object" && "data" in err
          ? (err as { data: { message: string } })?.data?.message
          : "Failed to delete employee.";
      toast.error(errorMessage);
    }
  };

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  if (isLoading) return <p>Loading employees...</p>;
  if (error) return <p>Error fetching employees.</p>;
  if (!employees.length) return <p>No employees found.</p>;

  return (
    <div>
      <h2>Employees List</h2>
      <table className="employee-table">
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Contact Number</th>
            <th>Join Date</th>
            <th>Salary</th>
            <th>Extra Working Hours</th>
            <th>Roles</th>
            <th>Salary Slip</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={employee.id}>
              <td>{index + 1}</td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.number || "N/A"}</td>
              <td>{employee.joiningDate || "N/A"}</td>
              <td>{employee.salary ?? "N/A"}</td>
              <td>{employee.dateOfHire ?? "N/A"}</td>
              <td>
                {employee.roles?.length
                  ? employee.roles.map((role) => capitalize(role.name)).join(", ")
                  : "N/A"}
              </td>
              <td> <FaEnvelope/> slip</td>
              <td>{employee.user_status || "N/A"}</td>
              <td>
                <button
                  onClick={() =>
                    navigateTo(
                      `/${currentData?.selected_company.company_slug}/hr/status-view/view-employee/${employee.id}`,
                      "Company slug not found"
                    )
                  }
                >
                  View
                </button>
                &nbsp;
                <button
                  onClick={() =>
                    navigateTo(
                      `/${currentData?.selected_company.company_slug}/hr/status-view/edit-employee/${employee.id}`,
                      "Company slug not found"
                    )
                  }
                >
                  Edit
                </button>
                &nbsp;
                <button onClick={() => handleDelete(employee.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .employee-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        .employee-table th,
        .employee-table td {
          border: 1px solid black;
          padding: 8px;
          text-align: left;
        }
        .employee-table th {
          background-color: #f4f4f4;
        }
      `}</style>
    </div>
  );
};

export default SalaryView;
