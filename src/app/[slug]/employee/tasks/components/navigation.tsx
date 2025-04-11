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
    <div className='navigation-buttons'>
      <Link href={`/${companySlug}/employee/tasks/task-timeline`} className='navigation-button'> <FaPlus /> <span>Task Timeline</span></Link>
      <Link href={`/${companySlug}/employee/tasks/add-task`} className='navigation-button'> <FaPlus /> <span>Add Task</span></Link>
      <Link href={`/${companySlug}/employee/attendence`} className='navigation-button'><span>Attendence</span></Link>

    </div>
  );
};

export default Navigation;
