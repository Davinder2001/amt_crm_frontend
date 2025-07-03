'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import { useGetCreditUsersQuery } from '@/slices/invoices/invoice';
import { useCompany } from '@/utils/Company';
import EmptyState from '@/components/common/EmptyState';
import { FaUsers } from 'react-icons/fa';

import ResponsiveTable from '@/components/common/ResponsiveTable';
import TableToolbar from '@/components/common/TableToolbar';
import { FaMoneyBill, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import LoadingState from '@/components/common/LoadingState';

interface CreditUser {
  customer_id: number;
  name: string;
  number: string;
  total_invoices: number;
  total_due: number;
  amount_paid: number;
  outstanding: number;
}

type ProcessedUser = CreditUser & { id: number };
type ColumnKey = keyof CreditUser | 'action';

const COLUMN_STORAGE_KEY = 'visible_columns_credit_users';

const allColumns: { label: string; key: ColumnKey }[] = [
  { label: 'Name', key: 'name' },
  { label: 'Number', key: 'number' },
  { label: 'Total Invoices', key: 'total_invoices' },
  { label: 'Total Due', key: 'total_due' },
  { label: 'Amount Paid', key: 'amount_paid' },
  { label: 'Outstanding', key: 'outstanding' },
  { label: 'Action', key: 'action' }
];

const CreditList: React.FC = () => {
  const router = useRouter();
  const { setTitle } = useBreadcrumb();
  const { data, isLoading, error } = useGetCreditUsersQuery();
  const { companySlug } = useCompany();

  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [visibleColumns, setVisibleColumns] = useState<ColumnKey[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(COLUMN_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as ColumnKey[]) : allColumns.map(col => col.key);
    }
    return allColumns.map(col => col.key);
  });

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

  const handleView = (userId: number) =>
    router.push(`/${companySlug}/invoices/credits/view/${userId}`);

  const handlePay = (userId: number) =>
    router.push(`/${companySlug}/invoices/credits/pay/${userId}`);

  const toggleColumn = (key: string) => {
    const columnKey = key as ColumnKey;
    setVisibleColumns(prev => {
      const updated = prev.includes(columnKey)
        ? prev.filter(col => col !== columnKey)
        : [...prev, columnKey];
      localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const onResetColumns = () => {
    const defaultCols = allColumns.map(col => col.key);
    setVisibleColumns(defaultCols);
    localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(defaultCols));
  };

  const filteredData = useMemo(() => {
    return processedUsers.filter((item) => {
      if (filters.search?.[0]) {
        const searchTerm = filters.search[0].toLowerCase();
        const keysToSearch = allColumns
          .filter(col => visibleColumns.includes(col.key) && col.key !== 'action')
          .map(col => col.key);

        const matchesSearch = keysToSearch.some(key => {
          const value = String(item[key as keyof CreditUser] ?? '').toLowerCase();
          return value.includes(searchTerm);
        });

        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [filters, processedUsers, visibleColumns]);

  const columns = allColumns
    .filter(col => visibleColumns.includes(col.key))
    .map(col => {
      if (col.key === 'action') {
        return {
          label: col.label,
          render: (item: ProcessedUser) => (
            <div onClick={(e) => e.stopPropagation()} className="pay-btn-outer">
              <button
                className="btn pay-btn"
                onClick={() => handlePay(item.customer_id)}
                title="Pay"
              >
                <FaMoneyBill /> Pay
              </button>
            </div>
          )
        };
      }

      return {
        label: col.label,
        key: col.key,
        render: (item: ProcessedUser) => {
          const val = item[col.key as keyof CreditUser];
          return val != null ? String(val) : '-';
        }
      };
    });

  if (isLoading) return <LoadingState />;
  if (error) return <EmptyState
    icon="alert"
    title="Failed to fetching Data."
    message="Something went wrong while fetching Data."
  />;

  return (
    <div>
      <Link href={`/${companySlug}/invoices`} className="back-button">
        <FaArrowLeft size={20} color="#fff" />
      </Link>

      <div className="credit-users-page">
        {filteredData.length === 0 ? (
          <EmptyState
            icon={<FaUsers className="empty-state-icon" />}
            title="No Credit Users Found"
            message="You don't have any users with outstanding invoices."
          />
        ) : (
          <>
            <TableToolbar
              filters={[
                {
                  key: 'search',
                  label: 'Search',
                  type: 'search' as const
                }
              ]}
              onFilterChange={(field, value, type) => {
                if (type === 'search') {
                  setFilters(prev => ({
                    ...prev,
                    [field]: value && typeof value === 'string' ? [value] : []
                  }));
                }
              }}
              columns={allColumns}
              visibleColumns={visibleColumns}
              onColumnToggle={toggleColumn}
              onResetColumns={onResetColumns}
              actions={[]}
              introKey='credit_list_intro'
            />

            <ResponsiveTable
              data={filteredData}
              columns={columns}
              onView={(id: number) => {
                const user = processedUsers.find(u => u.id === id);
                if (user && user.outstanding > 0) {
                  handleView(id);
                }
              }}
            />
          </>
        )}
      </div>
    </div>
  );


};

export default CreditList;
