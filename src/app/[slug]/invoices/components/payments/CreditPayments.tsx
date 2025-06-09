'use client';

import React from 'react';
import { useGetCreditPaymentHistoryQuery } from '@/slices/invoices/invoice';
import EmptyState from '@/components/common/EmptyState';
import { FaCreditCard } from 'react-icons/fa';
import LoadingState from '@/components/common/LoadingState';

export default function CreditPayments() {
  const { data, error, isLoading } = useGetCreditPaymentHistoryQuery();

  if (isLoading) return <LoadingState/>;

  if (error) {
    return (
      <EmptyState
        icon={<FaCreditCard className="empty-state-icon" />}
        title="Failed to load credit payments"
        message="There was an error while fetching credit payment history."
      />
    );
  }

  const creditGroups = data?.data ?? [];
  const hasNoData = creditGroups.length === 0;

  if (hasNoData) {
    return (
      <EmptyState
        icon={<FaCreditCard className="empty-state-icon" />}
        title="No Credit Payments Found"
        message="No credit transactions have been recorded yet."
      />
    );
  }

  return (
    <div>
      {creditGroups.map((group) => (
        <div key={group.date} style={{ marginBottom: 20 }}>
          <h3>Date: {group.date}</h3>
          <p>Total: {group.total}</p>
          <ul>
            {group.transactions.map((t, idx) => (
              <li key={idx}>
                Invoice#: {t.invoice_number}, Amount: {t.amount}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
