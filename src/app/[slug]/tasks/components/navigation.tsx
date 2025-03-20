'use client';

import React from 'react';
import Link from 'next/link';
import { useFetchProfileQuery, useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';

const Navigation: React.FC = () => {
  // Fetch company slug
    const { data: selectedCompany, isFetching } = useFetchSelectedCompanyQuery();
    // Extract companySlug from selectedCompany
    const companySlug = selectedCompany?.selected_company?.company_slug;

  if (isFetching) return <p>Loading...</p>;
  if (!companySlug) return <p>No company data found</p>;

  return (
    <div>
      <Link href={`/${companySlug}/tasks/add-task`}>Add Task</Link>
    </div>
  );
};

export default Navigation;
