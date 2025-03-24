'use client';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import React, { useEffect } from 'react'

const Page = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Store'); // Update breadcrumb title
  }, [setTitle]);
  return (
    <div>page</div>
  )
}

export default Page