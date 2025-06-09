"use client";
import React, { useEffect } from 'react'
import Company from './components/company'
import { useBreadcrumb } from '@/provider/BreadcrumbContext';


const Page = () => {
  const { setTitle } = useBreadcrumb();
      useEffect(() => {
        setTitle('All Compaines'); // Update breadcrumb title
      }, [setTitle]);
  return (
    <>
      <Company/>
    </>
  )
}

export default Page