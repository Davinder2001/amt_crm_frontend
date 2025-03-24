'use client';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import React, { useEffect } from 'react'

const Page = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Vehicle'); // Update breadcrumb title
  }, [setTitle]);
  return (
    <div>Page</div>
  )
}

export default Page