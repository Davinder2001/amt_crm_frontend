'use client';
import React, { useEffect } from 'react'
import SalaryView from './components/salaryView'
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { useCompany } from '@/utils/Company';

const Page = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Employees Salary'); // Update breadcrumb title
  }, [setTitle]);

  const { companySlug } = useCompany();

  return (
    <>
      <Link href={`/${companySlug}/employee/hr`} className='back-button'><FaArrowLeft size={20} color='#fff' /></Link>
      <SalaryView />
    </>
  )
}

export default Page