'use client';

import React from 'react';
import { useGetCashPaymentHistoryQuery } from '@/slices/invoices/invoice';
import EmptyState from '@/components/common/EmptyState';
import LoadingState from '@/components/common/LoadingState';
import { FaMoneyBillWave } from 'react-icons/fa';
import ResponsiveTable from '@/components/common/ResponsiveTable';
type CashTransaction = {
  invoice_number: string;
  amount: number;
  date: string;
  total: number;
};

export default function CashPayments() {
  const {
    data,
    error,
    isLoading,
  } = useGetCashPaymentHistoryQuery() as {
    data?: PaymentHistoryResponse<DateGroupedPayment>;
    error?: unknown;
    isLoading: boolean;
  };

  if (isLoading) return <LoadingState />;

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

  // Flatten the grouped transactions into a list and add a unique 'id' property
  const flattenedData: (CashTransaction & { id: number })[] = cashGroups.flatMap((group, groupIdx) =>
    group.transactions.map((t, tIdx) => ({
      ...t,
      date: group.date,
      total: group.total,
      id: Number(`${groupIdx}${tIdx}`), // Generates a unique numeric id
    }))
  );

  const columns = [
    { label: 'Date', key: 'date' as keyof CashTransaction },
    { label: 'Invoice Number', key: 'invoice_number' as keyof CashTransaction },
    { label: 'Amount', render: (row: CashTransaction) => `₹${row.amount}` },
    { label: 'Total of the Day', render: (row: CashTransaction) => `₹${row.total}` },
  ];

  return (
    <div className="cash-payments">
      <ResponsiveTable
        data={flattenedData}
        columns={columns}
        cardViewKey="invoice_number"
      />
    </div>
  );
}
