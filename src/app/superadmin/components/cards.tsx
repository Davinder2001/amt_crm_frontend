'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useFetchAdminsQuery } from '@/slices/superadminSlices/adminManagement/adminManageApi';
import { useFetchCompaniesQuery } from '@/slices/superadminSlices/company/companyApi';
import { FaUsers, FaBuilding, FaCheckCircle, FaClock } from 'react-icons/fa';

const Cards = () => {
  const router = useRouter();
  const { data: adminData, isLoading: loadingAdmins } = useFetchAdminsQuery();
  const { data: companyData, isLoading: loadingCompanies } = useFetchCompaniesQuery();

  const admins = adminData?.admins || [];
  const companies = companyData?.data || [];

  if (loadingAdmins || loadingCompanies) {
    return <div className="card-wrapper">Loading cards...</div>;
  }

  return (
    <div className="dashboard-container Sdash-container">
      <div className='overview-grid-container'>
      <div className="card clickable" onClick={() => router.push('/superadmin/admins')}>
        <span className='icon-shell'>
        <FaUsers className="card-icon blue" />
        </span>    
        <div className="dash-card-content">
        <h2 className="card-title ">Total Admins</h2>
        <p className="card-value blue">{admins.length}</p>
        </div>
      </div>

      <div className="card clickable" onClick={() => router.push('/superadmin/companies')}>
        <FaBuilding className="card-icon green" />
        <div className="dash-card-content">
        <h2 className="card-title">Total Companies</h2>
        <p className="card-value green">{companies.length}</p>
      </div>
      </div>

      <div className="card clickable" onClick={() => router.push('/companies?status=verified')}>
        <FaCheckCircle className="card-icon emerald" />
        <div className="dash-card-content">
        <h2 className="card-title">Verified Companies</h2>
        <p className="card-value emerald">
          {companies.filter((c) => c.verification_status === 'verified').length}
        </p>
      </div>
      </div>

      <div className="card clickable" onClick={() => router.push('/superadmin/companies/pending')}>
        <FaClock className="card-icon orange" />
        <div className="dash-card-content">
        <h2 className="card-title">Pending Companies</h2>
        <p className="card-value orange">
          {companies.filter((c) => c.verification_status === 'pending').length}
        </p>
      </div>
      </div>
</div>
      
    </div>
  );
};

export default Cards;
