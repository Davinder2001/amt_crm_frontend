import React from 'react';
import Link from 'next/link';
import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';
import { FaPlus } from 'react-icons/fa';

const Navigation = () => {
    // Fetch company slug
    const { data: selectedCompany } = useFetchSelectedCompanyQuery();
    const companySlug = selectedCompany?.selected_company?.company_slug;

    return (
        <>
            <div className="navigation-buttons">
                <Link className="navigation-button" href={`/${companySlug}/employee/attendence/applay-for-leave`}><FaPlus /><span>Applay for Leave</span></Link>
                <Link className="navigation-button" href={`/${companySlug}/employee/attendence/add`}><FaPlus /><span>Add Attendence</span></Link>
            </div>
        </>
    );
};

export default Navigation;
