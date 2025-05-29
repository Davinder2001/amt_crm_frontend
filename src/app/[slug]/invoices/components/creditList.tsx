'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import {
  useGetCreditUsersQuery,
} from '@/slices/invoices/invoice';
import { useCompany } from "@/utils/Company";

import ResponsiveTable from '@/components/common/ResponsiveTable';
import TableToolbar from '@/components/common/TableToolbar';
import { FaMoneyBill } from 'react-icons/fa';

const CreditList = () => {
  const router = useRouter();
  const { setTitle } = useBreadcrumb();
  const { data, isLoading, isError } = useGetCreditUsersQuery();
  const { companySlug } = useCompany();

  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

  useEffect(() => {
    setTitle('Credit Users');
  }, [setTitle]);

  const users = Array.isArray(data?.data) ? data.data : [];

  // Add `id` field for row click (view)
  const processedUsers = users.map((user) => ({
    ...user,
    id: user.customer_id,
  }));

  useEffect(() => {
    if (users.length > 0) {
      setVisibleColumns([
        'name',
        'number',
        'total_invoices',
        'total_due',
        'amount_paid',
        'outstanding',
        'action'
      ]);
    }
  }, [users]);

  const handleView = (userId: number) => {
    router.push(`/${companySlug}/invoices/credits/view/${userId}`);
  };

  const handlePay = (userId: number) => {
    router.push(`/${companySlug}/invoices/credits/pay/${userId}`);
  };

 

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
    );
  };

  const columns = visibleColumns.map((key) => ({
    label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    render: (item: any) => {
      if (key === 'action') {
        return (
          <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
            <button
              className="btn pay-btn"
              onClick={() => handlePay(item.customer_id)}
              title="Pay"
            >
              <FaMoneyBill />
            </button>
          </div>
        );
      }
      return item[key]?.toString() ?? '-';
    },
  }));

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong.</p>;

  return (
    <div className="credit-users-page">
      <TableToolbar
        filters={{}}
        onFilterChange={() => { }}
        columns={columns.map((col) => ({ label: col.label, key: col.label }))}
        visibleColumns={visibleColumns}
        onColumnToggle={(label) =>
          toggleColumn(label.toLowerCase().replace(/ /g, '_'))
        }
        actions={[]}
      />

      <ResponsiveTable
        data={processedUsers}
        columns={columns}
        onView={(id) => handleView(id)} // Row click goes to view
      />
    </div>
  );
};

export default CreditList;
