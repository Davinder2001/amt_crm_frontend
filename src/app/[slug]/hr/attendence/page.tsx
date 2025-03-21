'use client';
import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';
import Link from 'next/link'
import React from 'react'

const Page = () => {
  const {currentData} = useFetchSelectedCompanyQuery();
  return (
    <>
    <Link href={`/${currentData?.selected_company.company_slug}/hr`}>Back</Link>
    <div>Page</div>
    </>
  )
}

export default Page