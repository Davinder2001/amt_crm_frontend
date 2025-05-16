'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useGetInvoiceByIdQuery } from '@/slices/invoices/invoice';
import ResponsiveTable from '@/components/common/ResponsiveTable';

const InvoiceViewPage = () => {
  const params = useParams();
  const id = params?.id;

  const {
    data,
    isLoading,
    isError,
  } = useGetInvoiceByIdQuery(id as string, {
    skip: !id,
  });

  if (isLoading) return <div>Loading invoice...</div>;
  if (isError || !data?.invoice) return <div>Failed to load invoice.</div>;

  const { invoice } = data;

  const columns = [
    { label: 'Description', key: 'description' as keyof typeof invoice.items[0] },
    { label: 'Quantity', key: 'quantity' as keyof typeof invoice.items[0] },
    {
      label: 'Unit Price (₹)',
      render: (item: typeof invoice.items[0]) => `₹${item.unit_price}`,
    },
    {
      label: 'Total (₹)',
      render: (item: typeof invoice.items[0]) => `₹${item.total}`,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Invoice #{invoice.invoice_number}</h1>
      <p><strong>Client Name:</strong> {invoice.client_name || "N/A"}</p>
      <p><strong>Email:</strong> {invoice.client_email || "N/A"}</p>
      <p><strong>Date:</strong> {invoice.invoice_date}</p>
      <p><strong>Total:</strong> ₹{invoice.total_amount}</p>

      <h2 className="mt-6 font-semibold text-lg mb-2">Items</h2>

      <ResponsiveTable
        data={invoice.items}
        columns={columns}
      />
    </div>
  );
};

export default InvoiceViewPage;
