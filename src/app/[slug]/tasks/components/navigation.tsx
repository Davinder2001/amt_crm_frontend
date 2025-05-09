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
      <Link href={`/${companySlug}/tasks/task-timeline` } className='navigation-button'>  <span>Task Timeline</span></Link>
      <Link href={`/${companySlug}/tasks/add-task`} className='navigation-button'> <FaPlus/> <span>Add Task</span></Link>
      <Link href={`/${companySlug}/attendence`} className='navigation-button'><span>Attendence</span></Link>
      <Link href={`/${companySlug}/tasks/recurring-tasks`} className='navigation-button'><span>Recurring Tasks</span></Link>
    
    </div>
  );
};

export default Navigation;
