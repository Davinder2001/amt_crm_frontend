'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import { useGetCreditUsersQuery } from '@/slices/invoices/invoice';
import { useCompany } from "@/utils/Company";

import ResponsiveTable from '@/components/common/ResponsiveTable';
import TableToolbar from '@/components/common/TableToolbar';
import { FaMoneyBill } from 'react-icons/fa';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
// 1. Raw API shape
interface CreditUser {
  customer_id: number;
  name: string;
  number: string;
  total_invoices: number;
  total_due: number;
  amount_paid: number;
  outstanding: number;
}

// 2. Extend with `id` for the table
type ProcessedUser = CreditUser & { id: number };

// 3. Define the column keys you’ll actually display
type DataColumnKey = keyof CreditUser; // all real data fields
type ColumnKey = DataColumnKey | 'action';

const CreditList: React.FC = () => {
  const router = useRouter();
  const { setTitle } = useBreadcrumb();
  const { data, isLoading, isError } = useGetCreditUsersQuery();
  const { companySlug } = useCompany();
  const [visibleColumns, setVisibleColumns] = useState<ColumnKey[]>([]);

  useEffect(() => {
    setTitle('Credit Users');
  }, [setTitle]);

  const users = useMemo<CreditUser[]>(() => {
    return Array.isArray(data?.data) ? data.data : [];
  }, [data?.data]);

  const processedUsers = useMemo<ProcessedUser[]>(
    () => users.map((u) => ({ ...u, id: u.customer_id })),
    [users]
  );

  useEffect(() => {
    if (users.length) {
      setVisibleColumns([
        'name',
        'number',
        'total_invoices',
        'total_due',
        'amount_paid',
        'outstanding',
        'action',
      ]);
    }
  }, [users.length]);

  const handleView = (userId: number) =>
    router.push(`/${companySlug}/invoices/${userId}`);

  const handlePay = (userId: number) =>
    router.push(`/${companySlug}/invoices/credits/pay/${userId}`);

  // 4. Build columns with proper typing—no `any`
  const columns = visibleColumns.map<{
    label: string;
    render: (item: ProcessedUser) => React.ReactNode;
  }>((key) => ({
    label: key === 'action'
      ? 'Action'
      : key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    render: (item) => {
      if (key === 'action') {
        return (
          <div onClick={(e) => e.stopPropagation()} className="pay-btn-outer">
            <button
              className="btn pay-btn"
              onClick={() => handlePay(item.customer_id)}
              title="Pay"
            >
              <FaMoneyBill />Pay
            </button>
          </div>
        );
      }

      // Now `key` is one of DataColumnKey, so this is safe:
      const val = item[key];
      return val != null ? String(val) : '-';
    },
  }));

  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p>Something went wrong.</p>;

  return (
    <div>
      <Link href={`/${companySlug}/invoices`} className='back-button'>
        <FaArrowLeft size={20} color='#fff' />
      </Link>

      <div className="credit-users-page">
        <TableToolbar
          filters={{}}
          onFilterChange={() => { }}
          columns={columns.map((col) => ({ label: col.label, key: col.label }))}
          visibleColumns={visibleColumns.map((k) =>
            k === 'action'
              ? 'Action'
              : k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
          )}
          onColumnToggle={(label) => {
            const key = label === 'Action'
              ? 'action'
              : (label.toLowerCase().replace(/ /g, '_') as DataColumnKey);

            setVisibleColumns((prev) =>
              prev.includes(key)
                ? prev.filter((c) => c !== key)
                : [...prev, key]
            );
          }}
          actions={[]}
        />

        <ResponsiveTable
          data={processedUsers}
          columns={columns}
          onView={(id: number) => handleView(id)}
        />
      </div>
    </div>
  );
};

export default CreditList;
