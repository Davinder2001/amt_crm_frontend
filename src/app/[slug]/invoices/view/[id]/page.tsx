'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useGetInvoiceByIdQuery } from '@/slices/invoices/invoice';

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

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Invoice #{data.invoice.invoice_number}</h1>
      <p><strong>Client Name:</strong> {data.invoice.client_name || "N/A"}</p>
      <p><strong>Email:</strong> {data.invoice.client_email || "N/A"}</p>
      <p><strong>Date:</strong> {data.invoice.invoice_date}</p>
      <p><strong>Total:</strong> ₹{data.invoice.total_amount}</p>

      <h2 className="mt-4 font-semibold text-lg">Items</h2>
      <table className="mt-2 w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Unit Price</th>
            <th className="p-2 border">Total</th>
          </tr>
        </thead>
        <tbody>
          {(data.invoice.items ?? []).map((item, index) => (
            <tr key={index}>
              <td className="p-2 border">{item.description}</td>
              <td className="p-2 border">{item.quantity}</td>
              <td className="p-2 border">₹{item.unit_price}</td>
              <td className="p-2 border">₹{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceViewPage;
