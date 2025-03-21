'use client';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import React, { useEffect } from 'react'

function page() {
    const { setTitle } = useBreadcrumb();

    useEffect(() => {
        setTitle('Invoices'); // Update breadcrumb title
    }, []);
    return (
        <>
        Invoices page here
        </>
    )
}

export default page