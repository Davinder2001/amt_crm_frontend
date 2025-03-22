'use client';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import React, { useEffect } from 'react'

function page() {
    const { setTitle } = useBreadcrumb();

    useEffect(() => {
        setTitle('Services'); // Update breadcrumb title
    }, []);
    return (
        <>
            Services page here
        </>
    )
}

export default page