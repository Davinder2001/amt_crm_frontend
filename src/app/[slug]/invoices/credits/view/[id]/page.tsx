'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import { useCompany } from '@/utils/Company';
import { useGetCreditInvoiceByIdQuery } from '@/slices/invoices/invoiceApi';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import TableToolbar from '@/components/common/TableToolbar';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import { FaTriangleExclamation } from 'react-icons/fa6';

type CreditItem = {
  credit_id: number;
  invoice_number: string;
  invoice_id: number;
  invoice_date: string;
  final_amount: number;
  amount_paid: number;
  outstanding: number;
  status: string;
};

type CreditItemWithId = CreditItem & { id: number };

type DataColumnKey =
  | 'invoice_number'
  | 'credit_id'
  | 'invoice_date'
  | 'final_amount'
  | 'amount_paid'
  | 'outstanding'
  | 'status';

type ColumnKey = DataColumnKey; // no 'action'

const ViewCredits: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const { companySlug } = useCompany();
  const { setTitle } = useBreadcrumb();
  const { data, isLoading, isError } = useGetCreditInvoiceByIdQuery(Number(id)) as {
    data: { customer?: { name: string; email: string; number: string; total_due: number; credits: CreditItem[] } };
    isLoading: boolean;
    isError: boolean;
  };
  const [visibleColumns, setVisibleColumns] = useState<ColumnKey[]>([]);

  useEffect(() => {
    setTitle('Credit View');
  }, [setTitle]);

  const credits: CreditItem[] = useMemo(() => {
    return data?.customer?.credits ?? [];
  }, [data]);

  const processedCredits: CreditItemWithId[] = useMemo(() => {
    return credits.map((c) => ({ ...c, id: c.credit_id }));
  }, [credits]);


  useEffect(() => {
    if (credits.length) {
      setVisibleColumns([
        'invoice_number',
        'credit_id',
        'invoice_date',
        'final_amount',
        'amount_paid',
        'outstanding',
        'status',
      ]);
    }
  }, [credits.length]);

  const columns = visibleColumns.map((key) => ({
    label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    render: (item: CreditItemWithId) => {
      const value = item[key as DataColumnKey];
      const amountFields = ['final_amount', 'amount_paid', 'outstanding'];
      // Add ₹ only on amount fields, NOT credit_id
      if (typeof value === 'number' && amountFields.includes(key)) {
        return `₹${value}`;
      }
      return value ?? '-';
    },
  }));

  if (isLoading) return <LoadingState />;
  if (isError || !data?.customer) return <EmptyState
    icon={<FaTriangleExclamation className='empty-state-icon' />}
    title="Failed to fetching credit data."
    message="Something went wrong while fetching credit data."
  />;

  const customer = data.customer;

  return (
    <div className="credit-users-page">
      <div className="customer-summary">
        <h2>{customer.name}</h2>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>Phone:</strong> {customer.number}</p>
        <p><strong>Total Due:</strong> ₹{customer.total_due}</p>
      </div>

      <TableToolbar
        onFilterChange={() => { }}
        columns={columns.map((col) => ({ label: col.label, key: col.label }))}
        visibleColumns={visibleColumns.map((k) =>
          k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
        )}
        onColumnToggle={(label) => {
          const key = label.toLowerCase().replace(/ /g, '_') as DataColumnKey;
          setVisibleColumns((prev) =>
            prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
          );
        }}
        actions={[]}
        introKey='view_credits_intro'
      />

      <ResponsiveTable
        data={processedCredits}
        columns={columns}
        onView={(id) => {
          const credit = processedCredits.find((c) => c.id === id);
          if (credit?.invoice_id) {
            router.push(`/${companySlug}/invoices/${credit.invoice_id}`);
          }
        }}


      />
    </div>
  );
};

export default ViewCredits;
