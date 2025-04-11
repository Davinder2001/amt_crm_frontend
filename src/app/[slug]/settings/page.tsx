'use client';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import Link from 'next/link';
import React, { useEffect } from 'react'

const Page = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Settings'); 
  }, [setTitle]);
  return (
    <>
      <Link href="settings/store-settings">Store Settings</Link>
      <Link href="settings/shifts">Shifts</Link>
    </>
  )
}

export default Page