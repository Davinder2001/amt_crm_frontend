'use client';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import React, { useEffect } from 'react'
import AllInvoices from './components/allInvoices';
import { useFetchInvoicesQuery } from '@/slices';

function Page() {
  const { setTitle } = useBreadcrumb();
  const { data, isLoading, isError } = useFetchInvoicesQuery();

  const invoices = data?.invoices ?? [];

  useEffect(() => {
    setTitle('Invoices');
  }, [setTitle]);
  return (
    <>
      <div className="navigation">
      </div>
      <AllInvoices invoices={invoices} isLoadingInvoices={isLoading} isError={isError} />
    </>
  )
}

export default Page