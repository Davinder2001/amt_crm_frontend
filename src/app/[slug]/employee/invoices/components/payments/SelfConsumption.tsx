'use client';

import React from 'react';
import { useGetSelfConsumptionHistoryQuery } from '@/slices';
import EmptyState from '@/components/common/EmptyState';
import LoadingState from '@/components/common/LoadingState';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import { FaLeaf } from 'react-icons/fa';

type SelfConsumptionTransaction = {
  invoice_number: string;
  amount: number;
  date: string;
  total: number;
};

export default function SelfConsumption() {
  const {
    data,
    error,
    isLoading,
  } = useGetSelfConsumptionHistoryQuery() as {
    data?: PaymentHistoryResponse<DateGroupedPayment>;
    error?: unknown;
    isLoading: boolean;
  };

  if (isLoading) return <LoadingState />;

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
  if (groups.length === 0) {
    return (
      <EmptyState
        icon={<FaLeaf className="empty-state-icon" />}
        title="No Self-Consumption Payments Found"
        message="No self-consumption payment transactions have been recorded yet."
      />
    );
  }

  const flattenedData: (SelfConsumptionTransaction & { id: number })[] = groups.flatMap((group, groupIdx) =>
    group.transactions.map((transaction, txIdx) => ({
      ...transaction,
      date: group.date,
      total: group.total,
      id: Number(`${groupIdx}${txIdx}`), // unique id per transaction
    }))
  );

  const columns = [
    { label: 'Date', key: 'date' as keyof SelfConsumptionTransaction },
    { label: 'Invoice No.', key: 'invoice_number' as keyof SelfConsumptionTransaction },
    { label: 'Amount', render: (row: SelfConsumptionTransaction) => `₹${row.amount}` },
    { label: 'Total of the Day', render: (row: SelfConsumptionTransaction) => `₹${row.total}` },
  ];

  return (
    <div className="self-consumption-payments">
      <ResponsiveTable
        data={flattenedData}
        columns={columns}
      />
    </div>
  );
}
