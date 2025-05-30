'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFetchCustomerByIdQuery } from '@/slices/customers/customer';
import {
    useLazyDownloadInvoicePdfQuery,
} from "@/slices/invoices/invoice";
import { FaArrowLeft } from 'react-icons/fa';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import { useCompany } from '@/utils/Company';
import { toast } from "react-toastify";

const CustomerView = () => {
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
    const columns = [
        { label: 'Invoice ID', key: 'invoice_id' },
        { label: 'Invoice No', key: 'invoice_no' },
        {
            label: 'Subtotal (₹)',
            render: (invoice: any) => `₹${invoice.subtotal}`
        },
        {
            label: 'Actions',
            render: (invoice: any) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button className="buttons" onClick={() => handleDownloadPdf(invoice.id)}>
                        Download
                    </button>
                </div>
            ),
        }
    ];
    return (
        <div className="customer-view-container">
            <button onClick={() => router.back()} className="back-button">
                <FaArrowLeft size={18} />
            </button>
            <div className="customer-card">
                <h2>Customer Details</h2>
                <div className="info">
                    {customer.name && <p><strong>Name:</strong> {customer.name}</p>}
                    <p><strong>Company ID:</strong> {customer.company_id}</p>
                    {customer.number && <p><strong>Phone Number:</strong> {customer.number}</p>}
                    {customer.email && <p><strong>Email:</strong> {customer.email}</p>}
                    {customer.address && <p><strong>Address:</strong> {customer.address}</p>}
                    {customer.pincode && <p><strong>Email:</strong> {customer.pincode}</p>}
                </div>
            </div>


            <div className="invoice-section">
                <h3>Invoices</h3>
                {invoices.length > 0 ? (
                    <ResponsiveTable
                        data={invoices}
                        columns={columns}
                        onView={(id) => router.push(`/${companySlug}/invoices/${id}`)}
                        onEdit={(id) => router.push(`/${companySlug}/invoices/edit-invoice/${id}`)}
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
