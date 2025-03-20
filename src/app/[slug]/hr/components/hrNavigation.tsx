import React from 'react'
import Link from 'next/link';
import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';

const HrNavigation = () => {


    // Fetch company slug
      const { data: selectedCompany, isFetching } = useFetchSelectedCompanyQuery();
      // Extract companySlug from selectedCompany
      const companySlug = selectedCompany?.selected_company?.company_slug;
    
      if (isFetching) return <p>Loading...</p>;
      if (!companySlug) return <p>No company data found</p>;
  return (
    <>
     <div className="hr_navigation">
        <Link href={`/${companySlug}/hr/add-employee`}>Add Employee</Link>
        <Link href={`/${companySlug}/hr/invite-employee`}>Invite Employee</Link>
        <Link href={`/${companySlug}/hr/status-view`}>Status View</Link>
        <Link href={`/${companySlug}/hr/employee-salary`}>Employee Salary</Link>
        <Link href={`/${companySlug}/hr/attendence`}>Attendence</Link>
      </div>
    </>
  )
}

export default HrNavigation