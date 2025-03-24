'use client';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import React, { useEffect } from 'react'

function Page() {
    const { setTitle } = useBreadcrumb();

    useEffect(() => {
        setTitle('Services'); // Update breadcrumb title
    }, [setTitle]);
    return (
        <>
            Services page here
        </>
    )
}

export default Page