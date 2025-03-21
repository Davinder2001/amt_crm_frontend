'use client';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import React, { useEffect } from 'react'

function page() {
    const { setTitle } = useBreadcrumb();

    useEffect(() => {
        setTitle('Catalogue'); // Update breadcrumb title
    }, []);
    return (
        <>
            Catalogue page here
        </>
    )
}

export default page