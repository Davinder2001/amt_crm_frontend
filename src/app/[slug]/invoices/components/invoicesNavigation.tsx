'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaUsers, FaCreditCard, FaFileInvoice } from 'react-icons/fa';
import TableToolbar from '@/components/common/TableToolbar';
import { useCompany } from "@/utils/Company";

const InvoicesNavigation = () => {
  const router = useRouter();
  const { companySlug } = useCompany();

  return (
    <div className="invoice-toolbar-wrapper">
      <TableToolbar
        filters={{}}
        columns={[]} // No column toggles here, leave empty
        visibleColumns={[]}
        onColumnToggle={() => {}}
        onFilterChange={() => {}}
        actions={[
          {
            label: 'Add Invoice',
            icon: <FaPlus />,
            onClick: () => router.push(`/${companySlug}/invoices/new-invoice`),
          },
          {
            label: 'All Customers',
            icon: <FaUsers />,
            onClick: () => router.push(`/${companySlug}/invoices/customers`),
          },
          {
            label: 'Credits',
            icon: <FaCreditCard />,
            onClick: () => router.push(`/${companySlug}/invoices/credits`),
          },
          {
            label: 'Quotations',
            icon: <FaFileInvoice />,
            onClick: () => router.push(`/${companySlug}/invoices/qutations`),
          },
        ]}
        downloadActions={[]}
      />
    </div>
  );
};

export default InvoicesNavigation;
