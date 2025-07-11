'use client';

import React from 'react';
import Link from 'next/link';
import { useFetchAdminsQuery } from '@/slices/superadminSlices/adminManagement/adminManageApi';
import { useFetchCompaniesQuery } from '@/slices/superadminSlices/company/companyApi';
import { FaUsers, FaBuilding, FaCheckCircle, FaClock } from 'react-icons/fa';

const Cards = () => {
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
        <Link
          href="/superadmin/admins"
          className="s-card clickable admin-card"
          title="View all admins"
        >

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
        </Link>

        {/* Company Card */}
        <Link
          href="/superadmin/companies"
          className="s-card clickable company-card"
          title="View all companies"
        >

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
        </Link>

        {/* Verified Companies Card */}
        <Link
          href="/superadmin/companies?status=verified"
          className="s-card clickable verified-card"
          title="View verified companies"
        >
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
        </Link>

        {/* Pending Companies Card */}
        <Link
          href="/superadmin/companies?status=pending"
          className="s-card clickable pending-card"
          title="View pending companies"
        >

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
        </Link>
      </div>
    </div>
  );
};

export default Cards;