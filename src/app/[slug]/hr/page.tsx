'use client';

import React, { useEffect } from 'react';
import UserList from './components/UserList';
import RoleList from './components/RoleList';
import Navigation from './components/hrNavigation';
import HrHroSection from './(hrHome)/HrHroSection';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';



const Page: React.FC = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('H.R Details of Employees'); // Update breadcrumb title
  }, []);

  return (
    <div className="p-6">
      <Navigation />
      <HrHroSection />
      {/* <UserList /> */}
      <RoleList />
    </div>
  );
};

export default Page;