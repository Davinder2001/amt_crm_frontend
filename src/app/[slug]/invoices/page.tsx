'use client';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import React, { useEffect } from 'react'
import AllInvoices from './components/allInvoices';
import InvoicesNavigation from './components/invoicesNavigation';
import { useFetchInvoicesQuery } from '@/slices/invoices/invoice';

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
        <InvoicesNavigation invoices={invoices} />
      </div>
      <AllInvoices invoices={invoices} isLoadingInvoices={isLoading} isError={isError} />
    </>
  )
}

export default Page