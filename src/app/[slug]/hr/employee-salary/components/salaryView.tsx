"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  useDeleteEmployeMutation,
  useFetchEmployeesSalaryQuery,
} from "@/slices/employe/employe";
import ResponsiveTable from "@/components/common/ResponsiveTable"; // ✅ Import
import "react-toastify/dist/ReactToastify.css";
import { useCompany } from "@/utils/Company";
import { FaEnvelope } from "react-icons/fa";
import LoadingState from "@/components/common/LoadingState";
import EmptyState from "@/components/common/EmptyState";

const SalaryView: React.FC = () => {
  const router = useRouter();
  const { data: employeesData, error, isLoading, refetch } = useFetchEmployeesSalaryQuery();
  const [deleteEmployee] = useDeleteEmployeMutation();
  const { companySlug } = useCompany();


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

  const viewSlip = (employee: Employee) => {
    if (!employee.company_slug) {
      toast.error("Company slug not found for employee");
      return;
    }
    router.push(`/${employee.company_slug}/hr/employee-salary/pay-slip/${employee.id}`);
  };

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  if (isLoading) return <LoadingState/>;
  if (error) {
      return (
        <EmptyState
          icon="alert"
          title="Failed to fetching employees."
          message="Something went wrong while fetching employees."
        />
      );
    }
  if (!employeesData?.data?.length) return <p>No employees found.</p>;

  const columns = [
    {
      label: "Sr. No",
      render: (_: Employee, index: number) => index + 1,
    },
    { label: "Name", key: "name" as keyof Employee },
    { label: "Email", key: "email" as keyof Employee },
    { label: "Contact Number", key: "number" as keyof Employee },
    {
      label: "Current Salary",
      render: (employee: Employee) => employee.employee_salary?.current_salary ?? "N/A",
    },
    {
      label: "Roles",
      render: (employee: Employee) =>
        employee.roles?.length
          ? employee.roles.map((role) => capitalize(role.name)).join(", ")
          : "N/A",
    },
    {
      label: "Salary Slip",
      render: (employee: Employee) => (
        <span onClick={() => viewSlip(employee)} className="salary-slip">
          <FaEnvelope /> <span>Slip</span>
        </span>
      ),
    },
    {
      label: "Monthly Salary",
      render: (employee: Employee) => (
        <button
          onClick={() =>
            router.push(
              `/${employee.company_slug}/hr/employee-salary/monthly/${employee.id}`
            )
          }
          className="btn-primary salary-view-button"
        >
          Monthly
        </button>
      ),
    },
    { label: "Status", key: "user_status" as keyof Employee },
  ];

  return (
    <ResponsiveTable
      data={employeesData.data}
      columns={columns}
      onDelete={(id) => handleDelete(id)}
      onView={(id) => router.push(`/${companySlug}/hr/status-view/view-employee/${id}`)} // not much used here
    />
  );
};

export default SalaryView;
