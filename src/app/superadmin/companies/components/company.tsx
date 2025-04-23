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

  const companies: Company[] = data?.data || [];

  if (isLoading) return <div>Loading companies...</div>;
  if (error) return <div>Error loading companies.</div>;

  const handleNavigation = (route: string) => {
    console.log(`Navigating to: ${route}`);
    router.push(route);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Companies</h1>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Code</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Slug</th>
            <th className="border p-2">Payment</th>
            <th className="border p-2">Verification</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr key={c.id}>
              <td className="border p-2">{c.id}</td>
              <td className="border p-2">{c.company_id}</td>
              <td className="border p-2">{c.company_name}</td>
              <td className="border p-2">{c.company_slug}</td>
              <td className="border p-2">{c.payment_status}</td>
              <td className="border p-2">{c.verification_status}</td>
              <td className="border p-2 flex space-x-2">
                <FaEye
                  onClick={() => handleNavigation(`companies/view/${c.id}`)}
                  className="cursor-pointer text-blue-500"
                  title="View"
                />
                <FaEdit
                  onClick={() => handleNavigation(`companies/edit/${c.id}`)}
                  className="cursor-pointer text-green-500"
                  title="Edit"
                />
                <FaTrash
                  onClick={() => handleNavigation(`/companies/delete/${c.id}`)}
                  className="cursor-pointer text-red-500"
                  title="Delete"
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
