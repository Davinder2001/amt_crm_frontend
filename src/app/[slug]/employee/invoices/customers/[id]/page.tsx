'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFetchCustomerByIdQuery } from '@/slices/customers/customerApi';
import { useLazyDownloadInvoicePdfQuery } from "@/slices/invoices/invoiceApi";
import ResponsiveTable from '@/components/common/ResponsiveTable';
import { useCompany } from '@/utils/Company';
import { toast } from "react-toastify";

// Define types
type Invoice = {
  id: number;
  invoice_id: number;
  invoice_no: string;
  subtotal: number;
  // Add more fields if your invoice object includes them
};

type Customer = {
  id: number;
  name?: string;
  email?: string;
  number?: string;
  address?: string;
  pincode?: string;
  company_id: number;
  invoices?: Invoice[];
};

const CustomerView: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const { companySlug } = useCompany();
  const [triggerDownload] = useLazyDownloadInvoicePdfQuery();

  const { data, isLoading, isError } = useFetchCustomerByIdQuery(Number(id));

  if (isLoading) return <p className="loading">Loading...</p>;
  if (isError || !data || !data.customer) return <p className="error">Customer not found.</p>;

  const customer = data.customer as Customer;
  const invoices = customer.invoices ?? [];

  const handleDownloadPdf = async (invoiceId: number) => {
    try {
      const result = await triggerDownload(invoiceId).unwrap();
      const url = URL.createObjectURL(result);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice_${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Failed to download invoice PDF.");
    }
  };

  const columns: {
    label: string;
    key?: keyof Invoice;
    render?: (invoice: Invoice) => React.ReactNode;
  }[] = [
      { label: 'Invoice ID', key: 'invoice_id' },
      { label: 'Invoice No', key: 'invoice_no' },
      {
        label: 'Subtotal (₹)',
        render: (invoice: Invoice) => `₹${invoice.subtotal}`,
      },
      {
        label: 'Actions',
        render: (invoice: Invoice) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button className="buttons" onClick={() => handleDownloadPdf(invoice.id)}>
              Download
            </button>
          </div>
        ),
      },
    ];

  return (
    <div className="customer-view-container">
      <div className="customer-card">
        <h2>Customer Details</h2>
        <div className="info">
          {customer.name && <p><strong>Name:</strong> {customer.name}</p>}
          <p><strong>Company ID:</strong> {customer.company_id}</p>
          {customer.number && <p><strong>Phone Number:</strong> {customer.number}</p>}
          {customer.email && <p><strong>Email:</strong> {customer.email}</p>}
          {customer.address && <p><strong>Address:</strong> {customer.address}</p>}
          {customer.pincode && <p><strong>Pincode:</strong> {customer.pincode}</p>}
        </div>
      </div>

      <div className="invoice-section">
        <h3>Invoices</h3>
        {invoices.length > 0 ? (
          <ResponsiveTable<Invoice>
            data={invoices}
            columns={columns}
            onView={(id) => router.push(`/${companySlug}/employee/invoices/${id}`)}
            onEdit={(id) => router.push(`/${companySlug}/employee/invoices/edit-invoice/${id}`)}
            onDelete={(id) => console.log('Delete invoice', id)}
          />
        ) : (
          <p>No invoices available for this customer.</p>
        )}
      </div>
    </div>
  );
};

export default CustomerView;
