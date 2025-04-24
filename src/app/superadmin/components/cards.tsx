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
    <div className="card-wrapper">
      <div className="card clickable" onClick={() => router.push('/superadmin/admins')}>
        <FaUsers className="card-icon blue" />
        <h2 className="card-title">Total Admins</h2>
        <p className="card-value blue">{admins.length}</p>
      </div>

      <div className="card clickable" onClick={() => router.push('/superadmin/companies')}>
        <FaBuilding className="card-icon green" />
        <h2 className="card-title">Total Companies</h2>
        <p className="card-value green">{companies.length}</p>
      </div>

      <div className="card clickable" onClick={() => router.push('/companies?status=verified')}>
        <FaCheckCircle className="card-icon emerald" />
        <h2 className="card-title">Verified Companies</h2>
        <p className="card-value emerald">
          {companies.filter((c) => c.verification_status === 'verified').length}
        </p>
      </div>

      <div className="card clickable" onClick={() => router.push('/superadmin/companies/pending')}>
        <FaClock className="card-icon orange" />
        <h2 className="card-title">Pending Companies</h2>
        <p className="card-value orange">
          {companies.filter((c) => c.verification_status === 'pending').length}
        </p>
      </div>

      <style jsx>{`
        .card-wrapper {
          display: grid;
          gap: 1rem;
          padding: 1.5rem;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }

        .card {
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1.25rem;
          flex-direction: column;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
          text-align: center;
          transition: transform 0.2s ease;
        }

        .card:hover {
          transform: translateY(-4px);
        }

        .clickable {
          cursor: pointer;
        }

        .card-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0.5rem 0;
        }

        .card-value {
          font-size: 2rem;
          font-weight: bold;
        }

        .card-icon {
          font-size: 2.25rem;
          margin-bottom: 0.5rem;
        }

        .blue {
          color: #2563eb;
        }

        .green {
          color: #22c55e;
        }

        .emerald {
          color: #10b981;
        }

        .orange {
          color: #f97316;
        }
      `}</style>
    </div>
  );
};

export default Cards;
