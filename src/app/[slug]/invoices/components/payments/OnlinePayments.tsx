import React from 'react';
import { useGetOnlinePaymentHistoryQuery } from '@/slices/invoices/invoice';
import EmptyState from '@/components/common/EmptyState';
import LoadingState from '@/components/common/LoadingState';
import { FaGlobe } from 'react-icons/fa';
import ResponsiveTable from '@/components/common/ResponsiveTable';// adjust path if needed

type TransactionWithGroup = Transaction & {
  bank_name: string;
  account_number: string;
  bank_account_id: string;
  ifsc_code: string;
  total_transferred: number;
};

export default function OnlinePayments() {
  const {
    data,
    error,
    isLoading,
  } = useGetOnlinePaymentHistoryQuery() as {
    data?: PaymentHistoryResponse<OnlinePaymentGroup>;
    error?: unknown;
    isLoading: boolean;
  };

  if (isLoading) return <LoadingState />;

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

  if (groups.length === 0) {
    return (
      <EmptyState
        icon={<FaGlobe className="empty-state-icon" />}
        title="No Online Payments Found"
        message="No online payment transactions have been recorded yet."
      />
    );
  }

  const flattenedTransactions: (TransactionWithGroup & { id: number })[] = groups.flatMap((group) =>
    group.transactions.map((transaction, idx) => ({
      ...transaction,
      bank_name: group.bank_name,
      account_number: group.account_number,
      bank_account_id: group.bank_account_id != null ? String(group.bank_account_id) : '',
      ifsc_code: group.ifsc_code,
      total_transferred: group.total_transferred,
      id: transaction.id ?? idx, // Use transaction.id if exists, else fallback to index
    }))
  );

  const columns = [
    { label: 'Bank', key: 'bank_name' as keyof TransactionWithGroup },
    { label: 'Acount Id', key: 'bank_account_id' as keyof TransactionWithGroup },
    { label: 'Account Number', key: 'account_number' as keyof TransactionWithGroup },
    { label: 'IFSC', key: 'ifsc_code' as keyof TransactionWithGroup },
    { label: 'Invoice No.', key: 'invoice_number' as keyof TransactionWithGroup },
    { label: 'Invoice Date', key: 'invoice_date' as keyof TransactionWithGroup },
    {
      label: 'Amount',
      render: (row: TransactionWithGroup) => `₹${row.amount}`,
    },
    {
      label: 'Total Transferred',
      render: (row: TransactionWithGroup) => `₹${row.total_transferred}`,
    },
  ];

  return (
    <div className="online-payments">
      <ResponsiveTable
        data={flattenedTransactions}
        columns={columns}
      />
    </div>
  );
}
