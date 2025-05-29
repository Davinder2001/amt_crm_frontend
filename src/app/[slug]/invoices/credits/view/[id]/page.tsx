'use client';
import React, { useEffect } from 'react';
import { useGetCreditUsersQuery } from '@/slices/invoices/invoice';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';

const ViewCredits = () => {
  const { data, isLoading, isError } = useGetCreditUsersQuery();
  const { setTitle } = useBreadcrumb();

  if (isLoading) return <div className="view-credits__loading">Loading credit users...</div>;
  if (isError) return <div className="view-credits__error">Error fetching credit users.</div>;
  useEffect(() => {
    setTitle('Credit View'); // Update breadcrumb title
  }, [setTitle]);
  return (
    <div className="view-credits">

      {data?.data.length === 0 && <p className="view-credits__empty">No outstanding credits found.</p>}

      {data?.data.map((user) => (
        <div key={user.customer_id} className="view-credits__card">
          <h3 className="view-credits__name">{user.name}</h3>
          <p className="view-credits__info"><strong>Phone:</strong> {user.number}</p>
          <p className="view-credits__info"><strong>Total Invoices:</strong> {user.total_invoices}</p>
          <p className="view-credits__info"><strong>Total Due:</strong> ₹{user.total_due}</p>
          <p className="view-credits__info"><strong>Amount Paid:</strong> ₹{user.amount_paid}</p>
          <p className="view-credits__info"><strong>Outstanding:</strong> ₹{user.outstanding}</p>
        </div>
      ))}
    </div>
  );
};

export default ViewCredits;
