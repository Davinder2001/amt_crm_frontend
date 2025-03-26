"use client";
import { useBreadcrumb } from "@/provider/BreadcrumbContext";
import React, { useEffect } from "react";
import AddEmployeeForm from "./components/AddEmFrom";

const Page: React.FC = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Add Employee'); // Update breadcrumb title
  }, [setTitle]);

  return (
    <>
    <AddEmployeeForm/>
    </>
  );
};

export default Page;
