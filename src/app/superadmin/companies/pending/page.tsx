"use client";

import React, { useEffect } from 'react';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import { useFetchPendingCompaniesQuery, useVerifyCompanyPaymentMutation, useVerifyCompanyStatusMutation, } from '@/slices/superadminSlices/company/companyApi';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';


const PendingCompaniesPage = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Pending Companies');
  }, [setTitle]);

  const { data, isLoading, error, refetch } = useFetchPendingCompaniesQuery();
  const [verifyPayment, { isLoading: isVerifyingPayment }] = useVerifyCompanyPaymentMutation();
  const [verifyStatus, { isLoading: isVerifyingStatus }] = useVerifyCompanyStatusMutation();

  const handleVerifyPayment = async (id: number) => {
    try {
      await verifyPayment({ id, status: 'verified' }).unwrap();
      alert('Payment verified successfully.');
      refetch();
    } catch {
      alert('Failed to verify payment.');
    }
  };

  const handleVerifyStatus = async (id: number) => {
    try {
      await verifyStatus({ id, status: 'verified' }).unwrap();
      alert('Verification status updated successfully.');
      refetch();
    } catch {
      alert('Failed to verify status.');
    }
  };

  const columns = [
    { label: 'Company Name', key: 'company_name' },
    { label: 'Payment Status', key: 'payment_status' },
    { label: 'Verification Status', key: 'verification_status' },
    {
      label: 'Actions',
      render: (company: Company) => (
        <div className="action-buttons">
          <div><button type='button' onClick={() => handleVerifyPayment(company.id)} disabled={isVerifyingPayment}>
            Verify Payment
          </button>
          </div>
          <div>
            <button type='button' onClick={() => handleVerifyStatus(company.id)} disabled={isVerifyingStatus}>
              Verify Status
            </button>
          </div>
        </div>
      ),
    },
  ];

  if (isLoading) return <LoadingState />;
  if (error) return (
    <EmptyState
      icon="alert"
      title="Error loading companies."
      message="Something went wrong while loading companies."
    />);

  return (
    <div>
      {data?.data?.length ? (
        <ResponsiveTable data={data.data} columns={columns} />
      ) : (
        <p>No pending companies found.</p>
      )}
    </div>
  );
};
export default PendingCompaniesPage;