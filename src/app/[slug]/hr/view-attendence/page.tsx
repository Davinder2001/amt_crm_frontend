'use client';
import React from 'react'
import ViewAttendence from './components/viewAttendence'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa'
import { useCompany } from '@/utils/Company'

const Page = () => {
  const { companySlug } = useCompany();
  return (
    <>
      <Link href={`/${companySlug}/hr`} className='back-button'><FaArrowLeft size={20} color='#fff' /></Link>
      <ViewAttendence />
    </>
  )
}

export default Page