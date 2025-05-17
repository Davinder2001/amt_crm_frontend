"use client"
import React, { useEffect } from 'react'
import Cards from '@/app/superadmin/components/cards'
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import Footer from '@/app/[slug]/_common/footer/footer';


const Page = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Overview'); // Update breadcrumb title
  }, [setTitle]);
  return (
    <>
      <Cards />
      <Footer />
    </>
  )
}

export default Page