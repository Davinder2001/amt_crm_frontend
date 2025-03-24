'use client';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import React, { useEffect } from 'react'

const Page = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Quality Control'); // Update breadcrumb title
  }, [setTitle]);
  return (
    <div>Quality Control</div>
  )
}

export default Page