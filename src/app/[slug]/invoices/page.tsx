'use client';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import React, { useEffect } from 'react'
import AllInvoices from './components/allInvoices';

function Page() {
    const { setTitle } = useBreadcrumb();

    useEffect(() => {
        setTitle('Invoices');
    }, [setTitle]);
    return (
      <>
        <AllInvoices/>
      </>
    )
}

export default Page