'use client';
import React, { useEffect } from 'react'
// import AddInvoiceFrom from '../components/addInvoiceFrom'
// import CompanyDetails from '../components/companyDetails'
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import Link from 'next/link';
import { useCompany } from '@/utils/Company';
import { FaArrowLeft } from 'react-icons/fa';

const Page = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Add Invoices'); // Update breadcrumb title
  }, [setTitle]);
  const { companySlug } = useCompany();

  return (
    <>
      <Link href={`/${companySlug}/employee/invoices`} className='back-button'><FaArrowLeft size={20} color='#fff' /></Link>
      {/* <CompanyDetails /> */}
      {/* <AddInvoiceFrom /> */}
    </>
  )
}

export default Page