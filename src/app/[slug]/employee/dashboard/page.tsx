"use client";
import React, { useEffect } from 'react'
import ListOverview from './components/ListOverview'
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import Footer from '../../_common/footer/footer';

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
      <Footer />
    </>
  )
}

export default Page