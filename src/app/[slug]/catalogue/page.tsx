'use client';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import React, { useEffect } from 'react'
import ItemList from './components/itemList';

function Page() {
    const { setTitle } = useBreadcrumb();

    useEffect(() => {
        setTitle('Catalogue'); 
    }, [setTitle]);
    return (
        <>
            <ItemList/>
        </>
    )
}

export default Page