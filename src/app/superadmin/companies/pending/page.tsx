'use client';

import React from 'react';
import {
  useFetchPendingCompaniesQuery,
  useVerifyCompanyPaymentMutation,
  useVerifyCompanyStatusMutation,
} from '@/slices/superadminSlices/company/companyApi';

const PendingCompaniesPage = () => {
  const { data, isLoading, error, refetch } = useFetchPendingCompaniesQuery();
  const [verifyPayment, { isLoading: isVerifyingPayment }] = useVerifyCompanyPaymentMutation();
  const [verifyStatus, { isLoading: isVerifyingStatus }] = useVerifyCompanyStatusMutation();

  const handleVerifyPayment = async (id: number) => {
    try {
      await verifyPayment(id.toString()).unwrap();
      alert('Payment verified successfully.');
      refetch(); // Refresh list
    } catch (err) {
      console.error('Payment verification failed:', err);
      alert('Failed to verify payment.');
    }
  };

  const handleVerifyStatus = async (id: number) => {
    try {
      await verifyStatus(id.toString()).unwrap();
      alert('Verification status updated successfully.');
      refetch(); // Refresh list
    } catch (err) {
      console.error('Status verification failed:', err);
      alert('Failed to verify status.');
    }
  };

  if (isLoading) return <div>Loading pending companies...</div>;
  if (error) return <div>Error loading companies</div>;

  return (
    <div>
      <h1>Pending Companies</h1>

      {data?.data?.length ? (
        <table border={1}>
          <thead>
            <tr>
              <th>#</th>
              <th>Company Name</th>
              <th>Payment Status</th>
              <th>Verification Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((company, index) => (
              <tr key={company.id}>
                <td>{index + 1}</td>
                <td>{company.company_name}</td>
                <td>{company.payment_status}</td>
                <td>{company.verification_status}</td>
                <td>
                  <button onClick={() => handleVerifyPayment(company.id)} disabled={isVerifyingPayment}>
                    Verify Payment
                  </button>{' '}
                  <button onClick={() => handleVerifyStatus(company.id)} disabled={isVerifyingStatus}>
                    Verify Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No pending companies found.</p>
      )}
    </div>
  );
};

export default PendingCompaniesPage;
