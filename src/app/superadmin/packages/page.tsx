'use client';

import React, { useEffect } from 'react';
import PackagesView from './components/packagesView';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import BusinessCategories from './components/Categories';

const Page = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('All packages Plan');
  }, [setTitle]);

  return (
    <>
    <div className='BCategories-PView-container'>

      <BusinessCategories />
      <PackagesView />
    </div>
    </>
  );
};

export default Page;
