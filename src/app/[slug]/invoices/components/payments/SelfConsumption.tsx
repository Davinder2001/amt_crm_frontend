'use client';

import React from 'react';
import { useGetSelfConsumptionHistoryQuery } from '@/slices/invoices/invoice';
import EmptyState from '@/components/common/EmptyState';
import { FaLeaf } from 'react-icons/fa';
import LoadingState from '@/components/common/LoadingState';

export default function SelfConsumption() {
  const { data, error, isLoading } = useGetSelfConsumptionHistoryQuery();

  if (isLoading) return <LoadingState/>;

  if (error) {
    return (
      <EmptyState
        icon={<FaLeaf className="empty-state-icon" />}
        title="Failed to load self-consumption payments"
        message="There was an error fetching self-consumption payment data."
      />
    );
  }

  const groups = data?.data ?? [];
  const hasNoData = groups.length === 0;

  if (hasNoData) {
    return (
      <EmptyState
        icon={<FaLeaf className="empty-state-icon" />}
        title="No Self-Consumption Payments Found"
        message="No self-consumption payment transactions have been recorded yet."
      />
    );
  }

  return (
    <div>
      {groups.map((group) => (
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
