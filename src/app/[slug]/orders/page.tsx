'use client';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import React, { useEffect } from 'react'

const page = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Orders'); // Update breadcrumb title
  }, []);
  return (
    <div>orders page here</div>
  )
}

export default page