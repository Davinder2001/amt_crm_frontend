'use client';
import React, { useEffect } from 'react';
import { useGetCreditUsersQuery } from '@/slices/invoices/invoice';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import Link from 'next/link';
import { useCompany } from '@/utils/Company';
import { FaArrowLeft } from 'react-icons/fa';
const ViewCredits: React.FC = () => {
  const { data, isLoading, isError } = useGetCreditUsersQuery();
  const { setTitle } = useBreadcrumb();
  const { companySlug } = useCompany();

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
    <div>
      <Link href={`/${companySlug}/invoices/credits`} className='back-button'>
        <FaArrowLeft size={20} color='#fff' />
      </Link>
      <div className="view-credits-outer">
        {users.map((user) => (
          <div key={user.customer_id} className="view-credits__card">
            <div className='view-credits__card_inner'><h3 className="view-credits__name">{user.name}</h3>
              <div className='credits__card_wrapper' ><p className="view-credits__info">
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
                </p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewCredits;
