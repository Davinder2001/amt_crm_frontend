'use client';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import React, { useEffect } from 'react'

function Page() {
    const { setTitle } = useBreadcrumb();

    useEffect(() => {
        setTitle('Catalogue'); 
    }, [setTitle]);
    return (
        <>
            Catalogue 
        </>
    )
}

export default Page