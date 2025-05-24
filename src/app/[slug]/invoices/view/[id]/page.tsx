'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useGetInvoiceByIdQuery } from '@/slices/invoices/invoice';

const InvoiceViewPage = () => {
  const params = useParams();
  const id = params?.id;
  const { data, isLoading, isError } = useGetInvoiceByIdQuery(id as string, {
    skip: !id,
  });

  if (isLoading) return <div className="invoice-loading">Loading invoice...</div>;
  if (isError || !data?.invoice) return <div className="invoice-error">Failed to load invoice.</div>;

  const { invoice } = data;

  return (
    <div className="invoice-wrapper">
      <div className="invoice-card">
        <header className="invoice-header">
          <div className="invoice-title">
            <h1>
              <span className="holo-glow">INVOICE</span>
            </h1>
            <p className="invoice-number">#{invoice.invoice_number}</p>
          </div>
          <div className="invoice-date">
            <p>Date: <strong>{invoice.invoice_date}</strong></p>
          </div>
        </header>

        <section className="invoice-info">
          <div className="client-section">
            <h2>Client</h2>
            <p><strong>Name:</strong> {invoice.client_name}</p>
            <p><strong>Phone:</strong> {invoice.client_phone}</p>
            <p><strong>Email:</strong> {invoice.client_email}</p>
          </div>
          <div className="company-section">
            <h2>Other Info</h2>
            <p><strong>Issued By:</strong> {invoice.issued_by_name}</p>
            <p><strong>Payment Method:</strong> <span>{invoice.payment_method}</span></p>
          </div>
        </section>

        <section className="invoice-items">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>Price</th>
                <th>Tax %</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={item.id}>
                  <td>{i + 1}</td>
                  <td>{item.description}</td>
                  <td>₹{item.unit_price}</td>
                  <td>{item.tax_percentage}%</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="invoice-summary-outer">
          <div className="invoice-summary">
            <div className="summary-row"><span>Subtotal</span><span>₹{invoice.sub_total}</span></div>
            <div className="summary-row">
              <span>Service Charge</span>
              <span>
                ₹{invoice.service_charge_amount} + {invoice.service_charge_percent}% GST
                <span className="service-charge-percent"> ₹({invoice.service_charge_final})</span>
              </span>
            </div>
            <div className="summary-row"><span>Discount ({invoice.discount_percentage}%)</span><span>₹{invoice.discount_amount}</span></div>
            <div className="summary-row total">
              <span>Grand Total</span>
              <span className="view-invoice-final-amount">₹{invoice.final_amount}</span>
            </div>
          </div>
        </section>

        <footer className="invoice-footer">
          <p>Thank you for your business!</p>
        </footer>
      </div>
    </div>
  );
};

export default InvoiceViewPage;
