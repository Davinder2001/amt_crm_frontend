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
    return (
      <div className="dashboard-container Sdash-container">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="s-card shimmer">
            <div className="shimmer-content"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="dashboard-container Sdash-container">
      <div className='overview-grid-container'>
        {/* Admin Card */}
        <div 
          className="s-card clickable admin-card" 
          onClick={() => router.push('/superadmin/admins')}
        >
          <div className="card-bg-pattern"></div>
          <div className="card-content">
            <div className="icon-shell">
              <FaUsers className="card-icon" />
            </div>    
            <div className="dash-card-content">
              <h2 className="card-title">Total Admins</h2>
              <p className="card-value">{admins.length}</p>
              <div className="progress-tag">
                <span className="trend up">↑ 12% from last month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Company Card */}
        <div 
          className="s-card clickable company-card" 
          onClick={() => router.push('/superadmin/companies')}
        >
          <div className="card-bg-pattern"></div>
          <div className="card-content">
            <div className="icon-shell">
              <FaBuilding className="card-icon" />
            </div>
            <div className="dash-card-content">
              <h2 className="card-title">Total Companies</h2>
              <p className="card-value">{companies.length}</p>
              <div className="progress-tag">
                <span className="trend up">↑ 8% from last month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verified Companies Card */}
        <div 
          className="s-card clickable verified-card" 
          onClick={() => router.push('/companies?status=verified')}
        >
          <div className="card-bg-pattern"></div>
          <div className="card-content">
            <div className="icon-shell">
              <FaCheckCircle className="card-icon" />
            </div>
            <div className="dash-card-content">
              <h2 className="card-title">Verified Companies</h2>
              <p className="card-value">
                {companies.filter((c) => c.verification_status === 'verified').length}
              </p>
              <div className="progress-tag">
                <span className="trend up">↑ 15% from last month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Companies Card */}
        <div 
          className="s-card clickable pending-card" 
          onClick={() => router.push('/superadmin/companies/pending')}
        >
          <div className="card-bg-pattern"></div>
          <div className="card-content">
            <div className="icon-shell">
              <FaClock className="card-icon" />
            </div>
            <div className="dash-card-content">
              <h2 className="card-title">Pending Companies</h2>
              <p className="card-value">
                {companies.filter((c) => c.verification_status === 'pending').length}
              </p>
              <div className="progress-tag">
                <span className="trend down">↓ 5% from last month</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;