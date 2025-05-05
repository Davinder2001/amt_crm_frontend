'use client';
import React from 'react';

import AdminHome from '@/components/pages/AdminHome';
import UserHome from '@/components/pages/UserHome';
import EmployeeHome from '@/components/pages/EmployeeHome';
import SuperAdminHome from '@/components/pages/SuperAdminHome';
import Loader from '@/components/common/Loader';
import { useCompany } from '@/utils/Company';

function Page() {
  const { userType, accessToken } = useCompany();

  if (!accessToken) {
    return <Loader />;
  }

  switch (userType) {
    case 'admin':
      return <AdminHome />;
    case 'super-admin':
      return <SuperAdminHome />;
    case 'employee':
      return <EmployeeHome />;
    case 'user':
    default:
      return <UserHome />;
  }
}

export default Page;
