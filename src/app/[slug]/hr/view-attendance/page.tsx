'use client';
import React from 'react'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa'
import { useCompany } from '@/utils/Company'
import ViewAttendance from './components/ViewAttendance'

const Page = () => {
  const { companySlug } = useCompany();
  return (
    <>
      <Link href={`/${companySlug}/hr`} className='back-button'><FaArrowLeft size={20} color='#fff' /></Link>
      <ViewAttendance />
    </>
  )
}

export default Page