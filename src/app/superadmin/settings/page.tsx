"use client";
import React, { useEffect } from 'react'
import { useBreadcrumb } from '@/provider/BreadcrumbContext';

const Page = () => {
  const { setTitle } = useBreadcrumb();
    
      useEffect(() => {
        setTitle('Settings'); // Update breadcrumb title
      }, [setTitle]);
  return (
    <div>
        <p>Loading...</p>
    </div>
  )
}

export default Page