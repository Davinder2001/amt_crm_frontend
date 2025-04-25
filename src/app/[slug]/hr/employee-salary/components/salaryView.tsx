"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  useDeleteEmployeMutation,
  useFetchEmployeesSalaryQuery,
} from "@/slices/employe/employe";
import { FaEdit, FaEnvelope, FaEye, FaTrash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const SalaryView: React.FC = () => {
  const router = useRouter();
  const { data: employeesData, error, isLoading, refetch } = useFetchEmployeesSalaryQuery();
  const [deleteEmployee] = useDeleteEmployeMutation();

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
      refetch();
    } catch (err) {
      const errorMessage =
        err && typeof err === "object" && "data" in err
          ? (err as { data: { message: string } })?.data?.message
          : "Failed to delete employee.";
      toast.error(errorMessage);
    }
  };

  const view = (employee: Employee) => {
    if (!employee.company_slug) {
      toast.error("Company slug not found for employee");
      return;
    }
    router.push(`/${employee.company_slug}/hr/employee-salary/pay-slip/${employee.id}`);
  };


  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  if (isLoading) return <p>Loading employees...</p>;
  if (error) return <p>Error fetching employees.</p>;
  if (!employeesData?.data?.length) return <p>No employees found.</p>;

  return (
    <div>
      <table className="employee-table">
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Contact Number</th>
            <th>Current Salary</th>
            <th>Roles</th>
            <th>Salary Slip</th>
            <th>Monthly Salary</th> {/* ✅ New Column */}
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employeesData.data.map((employee, index: number) => (
            <tr key={employee.id}>
              <td>{index + 1}</td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.number || "N/A"}</td>
              <td>{employee.employee_salary?.current_salary ?? "N/A"}</td>
              <td>
                {employee.roles?.length
                  ? employee.roles.map((role) => capitalize(role.name)).join(", ")
                  : "N/A"}
              </td>
              <td>
                <span onClick={() => view(employee)} className="salary-slip">
                  <FaEnvelope /> <span>Slip</span>
                </span>
              </td>
              <td>
                <button onClick={() =>
                    navigateTo(
                      `/${employee.company_slug}/hr/employee-salary/monthly/${employee.id}`,
                      "Company slug not found"
                    )
                  } className="btn-primary">
                  Monthly
                </button>
              </td>
              <td>{employee.user_status || "N/A"}</td>
              <td className="user-td">
                <span
                  onClick={() =>
                    navigateTo(
                      `/${employee.company_slug}/hr/status-view/view-employee/${employee.id}`,
                      "Company slug not found"
                    )
                  }
                >
                    <FaEye color="#222" />
               
                </span>{" "}
                <span
                  onClick={() =>
                    navigateTo(
                      `/${employee.company_slug}/hr/status-view/edit-employee/${employee.id}`,
                      "Company slug not found"
                    )
                  }
                >
                  <FaEdit color="#222" />
                </span>{" "}
                <span onClick={() => handleDelete(employee.id)}>
                <FaTrash color="#222" />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalaryView;
