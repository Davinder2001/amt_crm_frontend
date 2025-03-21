'use client';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import React, { useEffect } from 'react'

const page = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Store'); // Update breadcrumb title
  }, []);
  return (
    <div>page</div>
  )
}

export default page