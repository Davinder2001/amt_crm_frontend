'use client';
import React, { useEffect } from 'react'
import Navigation from './components/navigation'
import AllTasks from './components/allTasks'
import { useBreadcrumb } from '@/provider/BreadcrumbContext';

const Page = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Tasks Details of Employees'); // Update breadcrumb title
  }, [setTitle]);
  return (
    <>
      <Navigation />
      <AllTasks />
    </>
  )
}

export default Page