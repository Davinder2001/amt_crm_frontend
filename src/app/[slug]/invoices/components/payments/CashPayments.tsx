'use client';

import React from 'react';
import { useGetCashPaymentHistoryQuery } from '@/slices/invoices/invoice';
import EmptyState from '@/components/common/EmptyState';
import { FaMoneyBillWave } from 'react-icons/fa';
import LoadingState from '@/components/common/LoadingState';

export default function CashPayments() {
  const { data, error, isLoading } = useGetCashPaymentHistoryQuery();

  if (isLoading) return <LoadingState/>;

  if (error) {
    return (
      <EmptyState
        icon={<FaMoneyBillWave className="empty-state-icon" />}
        title="Failed to load cash payments"
        message="There was an error while fetching cash payment history."
      />
    );
  }

  const cashGroups = data?.data ?? [];
  const hasNoData = cashGroups.length === 0;

  if (hasNoData) {
    return (
      <EmptyState
        icon={<FaMoneyBillWave className="empty-state-icon" />}
        title="No Cash Payments Found"
        message="No cash transactions have been recorded yet."
      />
    );
  }

  return (
    <div>
      {cashGroups.map((group) => (
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
