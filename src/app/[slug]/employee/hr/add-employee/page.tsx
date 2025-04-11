"use client";
import { useBreadcrumb } from "@/provider/BreadcrumbContext";
import React, { useEffect } from "react";
import AddEmployeeForm from "./components/AddEmFrom";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { useCompany } from "@/utils/Company";

const Page: React.FC = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Add Employee'); // Update breadcrumb title
  }, [setTitle]);
  const { companySlug } = useCompany();

  return (
    <>
      <Link href={`/${companySlug}/employee/hr`} className='back-button'><FaArrowLeft size={20} color='#fff' /></Link>
      <AddEmployeeForm />
    </>
  );
};

export default Page;
