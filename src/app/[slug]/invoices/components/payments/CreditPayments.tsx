'use client';

import React from 'react';
import { useGetCreditPaymentHistoryQuery } from '@/slices/invoices/invoice';
import EmptyState from '@/components/common/EmptyState';
import LoadingState from '@/components/common/LoadingState';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import { FaCreditCard } from 'react-icons/fa';

type CreditTransaction = {
  invoice_number: string;
  amount: number;
  date: string;
  total: number;
};

export default function CreditPayments() {
  const {
    data,
    error,
    isLoading,
  } = useGetCreditPaymentHistoryQuery() as {
    data?: PaymentHistoryResponse<DateGroupedPayment>;
    error?: unknown;
    isLoading: boolean;
  };

  if (isLoading) return <LoadingState />;

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
  if (creditGroups.length === 0) {
    return (
      <EmptyState
        icon={<FaCreditCard className="empty-state-icon" />}
        title="No Credit Payments Found"
        message="No credit transactions have been recorded yet."
      />
    );
  }

  const flattenedData: (CreditTransaction & { id: number })[] = creditGroups.flatMap((group) =>
    group.transactions.map((transaction, idx) => ({
      ...transaction,
      date: group.date,
      total: group.total,
      id: Number(`${group.date.replace(/-/g, '')}${idx}`), // unique id per transaction per day
    }))
  );

  const columns = [
    { label: 'Date', key: 'date' as keyof CreditTransaction },
    { label: 'Invoice Number', key: 'invoice_number' as keyof CreditTransaction },
    { label: 'Amount', render: (row: CreditTransaction) => `₹${row.amount}` },
    { label: 'Total of the Day', render: (row: CreditTransaction) => `₹${row.total}` },
  ];

  return (
    <div className="credit-payments">
      <ResponsiveTable
        data={flattenedData}
        columns={columns}
        cardViewKey="invoice_number"
      />
    </div>
  );
}
