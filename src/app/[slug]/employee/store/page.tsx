'use client';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import React, { useEffect } from 'react'
import Items from './components/items';
import StoreNavigation from './components/storeNavigation';

const Page = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Store');
  }, [setTitle]);
  return (
    <>
      <StoreNavigation/>
      <Items/>
    </>
  )
}

export default Page