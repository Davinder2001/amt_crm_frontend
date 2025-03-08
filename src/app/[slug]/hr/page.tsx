'use client';

import React from 'react';
import UserList from './components/UserList';
import RoleList from './components/RoleList';
import Link from 'next/link';
import { useFetchProfileQuery } from '@/slices/auth/authApi';

const Page: React.FC = () => {
  const { companySlug, isFetching } = useFetchProfileQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      companySlug: data?.user?.company_slug,
      isFetching,
    }),
  });

  if (isFetching) return <p>Loading...</p>;
  if (!companySlug) return <p>No company data found</p>;

  return (
    <div className="p-6">
      <div className="hr_navigation">
        <Link href={`/${companySlug}/hr/add-employee`}>Add Employee</Link>
        <Link href={`/${companySlug}/hr/invite-employee`}>Invite Employee</Link>
        <Link href={`/${companySlug}/hr/status-view`}>Status View</Link>
        <Link href={`/${companySlug}/hr/employee-salary`}>Employee Salary</Link>
        <Link href={`/${companySlug}/hr/attendence`}>Attendence</Link>
      </div>
      <UserList />
      <RoleList />
    </div>
  );
};

export default Page;