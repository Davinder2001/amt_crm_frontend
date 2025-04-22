'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useFetchCompaniesQuery } from '@/slices/superadminSlices/company/companyApi';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';

interface Company {
  id: number;
  company_id: string;
  company_name: string;
  company_slug: string;
  payment_status: string;
  verification_status: string;
  created_at: string;
  updated_at: string;
}

const CompanyComponent: React.FC = () => {
  const { data, error, isLoading } = useFetchCompaniesQuery();
  const router = useRouter();

  if (isLoading) return <div>Loading companies...</div>;
  if (error)   return <div>Error loading companies.</div>;

  const companies: Company[] = data?.data || [];

  return (
    <div>
      <h1>Companies</h1>
      <table className="company-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Code</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Payment Status</th>
            <th>Verification Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.company_id}</td>
              <td>{c.company_name}</td>
              <td>{c.company_slug}</td>
              <td>{c.payment_status}</td>
              <td>{c.verification_status}</td>
              <td className="actions">
                <FaEye
                  style={{ cursor: 'pointer', marginRight: 8 }}
                  onClick={() => router.push(`/companies/view/${c.id}`)}
                />
                <FaEdit
                  style={{ cursor: 'pointer', marginRight: 8 }}
                  onClick={() => router.push(`/companies/edit/${c.id}`)}
                />
                <FaTrash
                  style={{ cursor: 'pointer' }}
                  onClick={() => router.push(`/companies/delete/${c.id}`)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyComponent;
