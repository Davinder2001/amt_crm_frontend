'use client';

import React, { useEffect } from 'react'
import { useBreadcrumb } from "@/provider/BreadcrumbContext";
import PayCreditForm from '../../../components/payCreditForm'
import Link from 'next/link';
import { useCompany } from '@/utils/Company';
import { FaArrowLeft } from 'react-icons/fa';
const Page = () => {

  const { setTitle } = useBreadcrumb();
  const { companySlug } = useCompany();

  useEffect(() => {
    setTitle('Pay Credit'); // Update breadcrumb title
  }, [setTitle]);


  return (
    <>
      <div> <Link href={`/${companySlug}/invoices/credits`} className='back-button'>
        <FaArrowLeft size={20} color='#fff' />
      </Link></div>
      <PayCreditForm />
    </>
  )
}

export default Page