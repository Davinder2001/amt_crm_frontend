'use client';

import React, { useEffect } from 'react';
import Navigation from './components/hrNavigation';
import HrHroSection from './(hrHome)/HrHroSection';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';



const Page: React.FC = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('H.R Details of Employees'); // Update breadcrumb title
  }, [setTitle]);

  return (
    <div className="p-6">
      <Navigation />
      <HrHroSection />
    </div>
  );
};

export default Page;