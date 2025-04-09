'use client';
import React, { useEffect } from 'react'
import AttendancesList from './components/AttendancesList'
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import Navigation from './components/Navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { useCompany } from '@/utils/Company';

function Page() {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Attendances');
  }, [setTitle]);
  const { companySlug } = useCompany();
  return (
    <>
      <Link href={`/${companySlug}/hr`} className='back-button'><FaArrowLeft size={20} color='#fff' /></Link>
      <Navigation />
      <AttendancesList />
    </>
  )
}

export default Page