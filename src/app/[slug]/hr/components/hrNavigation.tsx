import React, { useState } from 'react';
import Link from 'next/link';
import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';
import InviteEmployeeForm from './InviteEmployeeForm';

const HrNavigation = () => {
  // State to control modal visibility
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);

  // Fetch company slug
  const { data: selectedCompany, isFetching } = useFetchSelectedCompanyQuery();
  const companySlug = selectedCompany?.selected_company?.company_slug;

  if (isFetching) return <p>Loading...</p>;
  if (!companySlug) return <p>No company data found</p>;

  return (
    <>
      <div className="hr_navigation">
        <Link href={`/${companySlug}/hr/add-employee`}>Add Employee</Link>
        <a href="#" onClick={(e) => { e.preventDefault(); setInviteModalOpen(true); }}>
          Invite Employee
        </a>
        <Link href={`/${companySlug}/hr/status-view`}>Status View</Link>
        <Link href={`/${companySlug}/hr/employee-salary`}>Employee Salary</Link>
        <Link href={`/${companySlug}/hr/attendence`}>Attendence</Link>
      </div>

      {/* Render InviteEmployeeForm as a popup when state is true */}
      {isInviteModalOpen && <InviteEmployeeForm onClose={() => setInviteModalOpen(false)} />}
    </>
  );
};

export default HrNavigation;
