'use client';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import React, { useEffect } from 'react'

function Page() {
    const { setTitle } = useBreadcrumb();

    useEffect(() => {
        setTitle('Catalogue'); // Update breadcrumb title
    }, [setTitle]);
    return (
        <>
            Catalogue page here
        </>
    )
}

export default Page