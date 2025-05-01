"use client"
import React, { useEffect } from 'react'
import Cards from '@/app/superadmin/components/cards'
import { useBreadcrumb } from '@/provider/BreadcrumbContext';


const Page = () => {
  const { setTitle } = useBreadcrumb();
  
    useEffect(() => {
      setTitle('Overview'); // Update breadcrumb title
    }, [setTitle]);
  return (
    <>
      <Cards />
    </>
  )
}

export default Page