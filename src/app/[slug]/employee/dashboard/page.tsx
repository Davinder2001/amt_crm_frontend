"use client";
import React, { useEffect } from 'react'
import ListOverview from './components/ListOverview'
import { useBreadcrumb } from '@/provider/BreadcrumbContext';

function Page() {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Overview'); // Update breadcrumb title
  }, [setTitle]);
  return (
    <>
      <div className="dashboard-page">
        <ListOverview />
      </div>
    </>
  )
}

export default Page