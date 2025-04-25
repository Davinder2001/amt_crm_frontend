'use client';
import React, { useEffect } from 'react'
import Navigation from './components/navigation'
import AllTasks from './components/allTasks'
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import MyTasks from './components/myTasks';

const Page = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Tasks Details of Employees');
  }, [setTitle]);
  return (
    <>
      <Navigation />
      <AllTasks />
      <MyTasks />
    </>
  )
}

export default Page