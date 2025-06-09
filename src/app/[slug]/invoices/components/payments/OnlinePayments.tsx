'use client';

import React from 'react';
import { useGetOnlinePaymentHistoryQuery } from '@/slices/invoices/invoice';
import EmptyState from '@/components/common/EmptyState';
import { FaGlobe } from 'react-icons/fa';
import LoadingState from '@/components/common/LoadingState';

export default function OnlinePayments() {
  const { data, error, isLoading } = useGetOnlinePaymentHistoryQuery();

  if (isLoading) return <LoadingState/>;

  if (error) {
    return (
      <EmptyState
        icon={<FaGlobe className="empty-state-icon" />}
        title="Failed to load online payments"
        message="There was an error fetching online payment data."
      />
    );
  }

  const groups = data?.data ?? [];
  const hasNoData = groups.length === 0;

  if (hasNoData) {
    return (
      <EmptyState
        icon={<FaGlobe className="empty-state-icon" />}
        title="No Online Payments Found"
        message="No online payment transactions have been recorded yet."
      />
    );
  }

  return (
    <div>
      {groups.map((group) => (
        <div key={group.bank_account_id ?? 'no-id'} style={{ marginBottom: 20 }}>
          <h3>
            {group.bank_name} - {group.account_number}
          </h3>
          <p>Total transferred: {group.total_transferred}</p>
          <ul>
            {group.transactions.map((t, idx) => (
              <li key={idx}>
                Invoice#: {t.invoice_number}, Date: {t.invoice_date}, Amount: {t.amount}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
