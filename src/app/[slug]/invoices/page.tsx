'use client';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import React, { useEffect } from 'react'

function Page() {
    const { setTitle } = useBreadcrumb();

    useEffect(() => {
        setTitle('Invoices'); // Update breadcrumb title
    }, [setTitle]);
    return (
        <>
        Invoices page here
        </>
    )
}

export default Page