'use client';;
import React from 'react'
import AllInvoices from './components/allInvoices';
import { useFetchInvoicesQuery } from '@/slices';

function Page() {
  const { data, isLoading, isError } = useFetchInvoicesQuery();

  const invoices = data?.invoices ?? [];
  return (
    <>
      <AllInvoices invoices={invoices} isLoadingInvoices={isLoading} isError={isError} />
    </>
  )
}

export default Page