'use client';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import React, { useEffect } from 'react'

const Page = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Settings'); // Update breadcrumb title
  }, [setTitle]);
  return (
    <div>Settings page here</div>
  )
}

export default Page