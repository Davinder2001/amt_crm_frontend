'use client';

import React from 'react';
import Link from 'next/link';
import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';
import { FaPlus } from 'react-icons/fa';

const Navigation: React.FC = () => {
  // Fetch company slug
    const { data: selectedCompany, isFetching } = useFetchSelectedCompanyQuery();
    // Extract companySlug from selectedCompany
    const companySlug = selectedCompany?.selected_company?.company_slug;

  if (isFetching) return <p>Loading...</p>;
  if (!companySlug) return <p>No company data found</p>;

  return (
    <div>
      <Link href={`/${companySlug}/tasks/add-task`}> <FaPlus/> Add Task</Link>
      <Link href={`/${companySlug}/tasks/task-timeline`}> <FaPlus/> Task Timeline</Link>
    </div>
  );
};

export default Navigation;
