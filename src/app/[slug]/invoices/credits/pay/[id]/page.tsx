'use client';

import React, { useEffect } from 'react'
import { useBreadcrumb } from "@/provider/BreadcrumbContext";

import PayCreditForm from '../../../components/payCreditForm'

const Page = () => {

  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Pay Credit'); // Update breadcrumb title
  }, [setTitle]);

  
  return (
    <>
      <PayCreditForm />
    </>
  )
}

export default Page