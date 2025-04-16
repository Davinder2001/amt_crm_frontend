'use client';
import React, { useEffect } from 'react'
// import AddInvoiceFrom from '../components/addInvoiceFrom'
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import Link from 'next/link';
import { useCompany } from '@/utils/Company';
import { FaArrowLeft } from 'react-icons/fa';
import POSPage from '../pos/POSPage';

const Page = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Add Invoices');
  }, [setTitle]);
  const { companySlug } = useCompany();

  return (
    <>
      <Link href={`/${companySlug}/invoices`} className='back-button'><FaArrowLeft size={20} color='#fff' /></Link>
      {/* <AddInvoiceFrom /> */}
      <POSPage />
    </>
  )
}

export default Page