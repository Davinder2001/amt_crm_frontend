'use client';
import React, { useEffect } from 'react';
import { useGetCreditUsersQuery } from '@/slices/invoices/invoice';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';

const ViewCredits: React.FC = () => {
  const { data, isLoading, isError } = useGetCreditUsersQuery();
  const { setTitle } = useBreadcrumb();

  // ✅ Always call hooks before any conditional returns
  useEffect(() => {
    setTitle('Credit View');
  }, [setTitle]);

  if (isLoading) {
    return (
      <div className="view-credits__loading">
        Loading credit users...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="view-credits__error">
        Error fetching credit users.
      </div>
    );
  }

  const users = data?.data || [];

  if (users.length === 0) {
    return (
      <div className="view-credits">
        <p className="view-credits__empty">No outstanding credits found.</p>
      </div>
    );
  }

  return (
    <div className="view-credits">
      {users.map((user) => (
        <div key={user.customer_id} className="view-credits__card">
          <h3 className="view-credits__name">{user.name}</h3>
          <p className="view-credits__info">
            <strong>Phone:</strong> {user.number}
          </p>
          <p className="view-credits__info">
            <strong>Total Invoices:</strong> {user.total_invoices}
          </p>
          <p className="view-credits__info">
            <strong>Total Due:</strong> ₹{user.total_due}
          </p>
          <p className="view-credits__info">
            <strong>Amount Paid:</strong> ₹{user.amount_paid}
          </p>
          <p className="view-credits__info">
            <strong>Outstanding:</strong> ₹{user.outstanding}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ViewCredits;
