'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFetchCompaniesQuery } from '@/slices/superadminSlices/company/companyApi';
import { toast } from 'react-toastify';
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

  const [localCompanies, setLocalCompanies] = useState<Company[]>([]);

  useEffect(() => {
    if (data?.data) {
      setLocalCompanies(data.data);
    }
  }, [data]);

  const paymentStatusOptions = ['pending', 'processing', 'completed', 'failed'];
  const verificationStatusOptions = ['pending', 'under_review', 'verified', 'rejected'];

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  const handlePaymentChange = (companyId: number, value: string) => {
    setLocalCompanies((prev) =>
      prev.map((c) =>
        c.id === companyId ? { ...c, payment_status: value } : c
      )
    );
    toast.success(`Payment marked as "${value}" successfully.`);
  };

  const handleVerificationChange = (companyId: number, value: string) => {
    setLocalCompanies((prev) =>
      prev.map((c) =>
        c.id === companyId ? { ...c, verification_status: value } : c
      )
    );
    toast.success(`Verification marked as "${value}" successfully.`);
  };

  if (isLoading) return <div>Loading companies...</div>;
  if (error) return <div>Error loading companies.</div>;

  return (
    <div className="company-table-outer">
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
          {localCompanies.map((c) => (
            <tr key={c.id}>
              <td className="border p-2">{c.id}</td>
              <td className="border p-2">{c.company_id}</td>
              <td className="border p-2">{c.company_name}</td>
              <td className="border p-2">{c.company_slug}</td>
              <td className="border p-2">
                <select
                  className={`payment-select ${c.payment_status} border rounded px-2 py-1`}
                  value={c.payment_status}
                  onChange={(e) => handlePaymentChange(c.id, e.target.value)}
                >
                  {paymentStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </td>

              <td className="border p-2">
                <select
                  className={`verification-select ${c.verification_status} border rounded px-2 py-1`}
                  value={c.verification_status}
                  onChange={(e) => handleVerificationChange(c.id, e.target.value)}
                >
                  {verificationStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status
                        .charAt(0)
                        .toUpperCase() + status.slice(1).replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </td>

              <td className="border p-2 flex space-x-2 store-t-e-e-icons">
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
