'use client';

import React from 'react';
import { useGetCardPaymentHistoryQuery } from '@/slices/invoices/invoice';
import EmptyState from '@/components/common/EmptyState';
import { FaCreditCard } from 'react-icons/fa';
import LoadingState from '@/components/common/LoadingState';

export default function CardPayments() {
  const { data, error, isLoading } = useGetCardPaymentHistoryQuery();

  if (isLoading) return <LoadingState/>;

  if (error) {
    return (
      <EmptyState
        icon={<FaCreditCard className="empty-state-icon" />}
        title="Failed to load card payments"
        message="There was an error while fetching card payment history."
      />
    );
  }

  const cardGroups = data?.data ?? [];
  const hasNoData = cardGroups.length === 0;

  if (hasNoData) {
    return (
      <EmptyState
        icon={<FaCreditCard className="empty-state-icon" />}
        title="No Card Payments Found"
        message="No card transactions have been recorded yet."
      />
    );
  }

  return (
    <div>
      {cardGroups.map((group) => (
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
