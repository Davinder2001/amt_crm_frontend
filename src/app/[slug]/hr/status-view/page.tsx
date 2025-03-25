'use client';
import Link from 'next/link'
import React, { useEffect } from 'react'
import UserList from './components/userList'
import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi'
import { useBreadcrumb } from '@/provider/BreadcrumbContext';

const Page = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Status of Employees'); // Update breadcrumb title
  }, [setTitle]);

  const { currentData } = useFetchSelectedCompanyQuery();
  return (
    <>
      <Link href={`/${currentData?.selected_company.company_slug}/hr`}>Back</Link>
      <UserList />
    </>
  )
}

export default Page