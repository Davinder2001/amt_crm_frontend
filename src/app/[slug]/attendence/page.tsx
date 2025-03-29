'use client';
import React, { useEffect } from 'react'
import AttendancesList from './components/AttendancesList'
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import Navigation from './components/Navigation';

function Page() {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Attendances');
  }, [setTitle]);
  return (
    <>
      <Navigation />
      <AttendancesList />
    </>
  )
}

export default Page