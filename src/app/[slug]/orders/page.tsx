'use client';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import React, { useEffect } from 'react'

const Page = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Orders'); // Update breadcrumb title
  }, [setTitle]);
  return (
    <div>orders page here</div>
  )
}

export default Page