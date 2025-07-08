'use client';

import React from 'react';
import { useGetCardPaymentHistoryQuery } from '@/slices/invoices/invoiceApi';
import EmptyState from '@/components/common/EmptyState';
import LoadingState from '@/components/common/LoadingState';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import { FaCreditCard } from 'react-icons/fa';
type CardTransaction = {
  invoice_number: string;
  amount: number;
  date: string;
  total: number;
};

export default function CardPayments() {
  const {
    data,
    error,
    isLoading,
  } = useGetCardPaymentHistoryQuery() as {
    data?: PaymentHistoryResponse<DateGroupedPayment>;
    error?: unknown;
    isLoading: boolean;
  };

  if (isLoading) return <LoadingState />;

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

  // Flatten transactions for table and add a unique numeric id to each row
  const flattenedData: (CardTransaction & { id: number })[] = cardGroups.flatMap((group, groupIdx) =>
    group.transactions.map((t, tIdx) => ({
      ...t,
      date: group.date,
      total: group.total,
      id: groupIdx * 1000 + tIdx, // ensures uniqueness
    }))
  );

  const columns = [
    { label: 'Date', key: 'date' as keyof CardTransaction },
    { label: 'Invoice No.', key: 'invoice_number' as keyof CardTransaction },
    { label: 'Amount', render: (row: CardTransaction) => `₹${row.amount}` },
    { label: 'Total of the Day', render: (row: CardTransaction) => `₹${row.total}` },
  ];

  return (
    <div className="card-payments">
      <ResponsiveTable
        data={flattenedData}
        columns={columns}
      />
    </div>
  );
}
