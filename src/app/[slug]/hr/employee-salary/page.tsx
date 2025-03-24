'use client';
import React, { useEffect } from 'react'
import SalaryView from './components/salaryView'
import { useBreadcrumb } from '@/provider/BreadcrumbContext';

const Page = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Employees Salary'); // Update breadcrumb title
  }, [setTitle]);
  return (
    <>
      <SalaryView />
    </>
  )
}

export default Page