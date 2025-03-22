'use client';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import React, { useEffect } from 'react'

const page = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Settings'); // Update breadcrumb title
  }, []);
  return (
    <div>Settings page here</div>
  )
}

export default page