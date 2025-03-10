'use client';

import React from 'react';
import Link from 'next/link';
import { useFetchProfileQuery } from '@/slices/auth/authApi';

const Navigation: React.FC = () => {
  const { companySlug, isFetching } = useFetchProfileQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      companySlug: data?.user?.company_slug,
      isFetching,
    }),
  });

  if (isFetching) return <p>Loading...</p>;
  if (!companySlug) return <p>No company data found</p>;

  return (
    <div>
      <Link href={`/${companySlug}/tasks/add-task`}>Add Task</Link>
    </div>
  );
};

export default Navigation;
