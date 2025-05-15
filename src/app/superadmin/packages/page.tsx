'use client';

import React, { useEffect } from 'react';
import PackagesView from './components/packagesView';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';

const Page = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('All packages Plan');
  }, [setTitle]);

  return (
    <>
      <PackagesView />
    </>
  );
};

export default Page;
