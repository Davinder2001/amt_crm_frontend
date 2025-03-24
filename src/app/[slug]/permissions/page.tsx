'use client';
import React, { useEffect } from 'react'
import RoleList from '../hr/components/RoleList'
import { useBreadcrumb } from '@/provider/BreadcrumbContext';

const Page = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Permissions'); // Update breadcrumb title
  }, [setTitle]);
  return (
    <>
      <RoleList />
    </>
  )
}

export default Page