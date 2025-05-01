"use client";
import React, { useEffect } from 'react'
import AdminList from '../components/adminList'
import { useBreadcrumb } from '@/provider/BreadcrumbContext';

const Page = () => {
  const { setTitle } = useBreadcrumb();
  
    useEffect(() => {
      setTitle('All Admins'); // Update breadcrumb title
    }, [setTitle]);
  return (
    <>
      <AdminList/>
    </>
  )
}

export default Page