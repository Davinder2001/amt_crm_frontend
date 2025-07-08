"use client";
import { useBreadcrumb } from "@/provider/BreadcrumbContext";
import React, { useEffect } from "react";
// import AddEmployeeForm from "./components/AddEmFrom";
import EmployeeForm from "../components/EmployeeForm";

const AddEmployee: React.FC = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Add Employee'); // Update breadcrumb title
  }, [setTitle]);

  return (
    <>
      {/* <AddEmployeeForm /> */}
      <EmployeeForm mode="add" />
    </>
  );
};

export default AddEmployee;
