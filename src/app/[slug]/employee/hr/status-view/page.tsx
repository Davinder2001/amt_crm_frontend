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
    <>
      <div className="status-view-page">
        <Link href={`/${currentData?.selected_company.company_slug}/employee/hr`} className='back-button'><FaArrowLeft size={20} color='#fff' /></Link>
        <UserList />
      </div>
    </>
  )
}

export default Page