'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaUsers, FaCreditCard, FaFileInvoice } from 'react-icons/fa';
import TableToolbar from '@/components/common/TableToolbar';
import { useCompany } from "@/utils/Company";

interface InvoiceNavigationProps {
  invoices: Invoice[];
}

const InvoicesNavigation: React.FC<InvoiceNavigationProps> = ({ invoices }) => {
  const router = useRouter();
  const { companySlug } = useCompany();

  const actions = [
    ...(invoices.length > 0
      ? [{
        label: 'Add Invoice',
        icon: <FaPlus />,
        onClick: () => router.push(`/${companySlug}/invoices/new-invoice`),
      }]
      : []),
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
  ];

  return (
    <div className="invoice-toolbar-wrapper">
      <TableToolbar
        actions={actions}
      />
    </div>
  );
};

export default InvoicesNavigation;
