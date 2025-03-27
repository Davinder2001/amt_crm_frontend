'use client';
import Link from 'next/link'
import React, { useEffect } from 'react'
import UserList from './components/userList'
import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi'
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import { FaArrowLeft } from 'react-icons/fa';

const Page = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Status of Employees'); // Update breadcrumb title
  }, [setTitle]);

  const { currentData } = useFetchSelectedCompanyQuery();
  return (
    <div className='back-button'>
      <Link href={`/${currentData?.selected_company.company_slug}/hr`}><FaArrowLeft className='back-icon' /></Link>
      <UserList />
    </div>
  )
}

export default Page