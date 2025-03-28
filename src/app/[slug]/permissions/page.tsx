'use client';
import React, { useEffect } from 'react'
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import RoleList from './components/roleList';

const Page = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Permissions'); // Update breadcrumb title
  }, [setTitle]);
  return (
    <>
      <RoleList/>
    </>
  )
}

export default Page