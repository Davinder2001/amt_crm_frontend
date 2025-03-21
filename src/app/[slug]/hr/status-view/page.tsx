'use client';
import Link from 'next/link'
import React from 'react'
import UserList from './components/userList'
import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi'

const Page = () => {
  const {currentData} = useFetchSelectedCompanyQuery();
  return (
    <>
    <Link href={`/${currentData?.selected_company.company_slug}/hr`}>Back</Link>
    <UserList/>
    </>
  )
}

export default Page