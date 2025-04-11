'use client';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import React, { useEffect } from 'react'
import AllInvoices from './components/allInvoices';
import InvoicesNavigation from './components/invoicesNavigation';

function Page() {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Invoices');
  }, [setTitle]);
  return (
    <>
      <div className="navigation">
        <InvoicesNavigation />
      </div>
      <AllInvoices />
    </>
  )
}

export default Page