'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { useGetInvoiceByIdQuery } from '@/slices/invoices/invoiceApi';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';


const InvoiceViewPage = () => {
  const params = useParams();
  const id = params?.id;

  const router = useRouter();
  const { data, isLoading, error } = useGetInvoiceByIdQuery(id as string, {
    skip: !id,
  });

  if (isLoading) return <LoadingState />;
  if (error || !data?.invoice) return (
    <EmptyState
      icon={<FaTriangleExclamation className='empty-state-icon' />}
      title="Failed to fetching employees."
      message="Something went wrong while fetching employees."
    />
  );;

  const { invoice } = data;

  return (
    <div>
      <div
        onClick={() => router.back()}
        className="back-button"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && router.back()}
      >
        <FaArrowLeft size={20} color="#fff" />
      </div>
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
              {invoice.client_name && <p><strong>Name:</strong> {invoice.client_name}</p>}
              {invoice.client_phone && <p><strong>Phone:</strong> {invoice.client_phone}</p>}
              {invoice.client_email && <p><strong>Email:</strong> {invoice.client_email}</p>}

              {invoice.delivery_pincode && (
                <p><strong>Delivery Pincode:</strong> {invoice.delivery_pincode}</p>
              )}
            </div>

            <div className="company-section">
              <h2>Other Info</h2>
              {invoice.issued_by_name && <p><strong>Issued By:</strong> {invoice.issued_by_name}</p>}
              {invoice.payment_method && (
                <p><strong>Payment Method:</strong> <span>{invoice.payment_method}</span></p>
              )}
              {invoice.delivery_address && (
                <p><strong>Delivery Address:</strong> {invoice.delivery_address}</p>
              )}
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
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{invoice.sub_total}</span>
              </div>

              {invoice.service_charge_amount > 0 && (
                <div className="summary-row">
                  <span>Service Charge</span>
                  <span>
                    ₹{invoice.service_charge_amount} + {invoice.service_charge_percent}% GST
                    <span className="service-charge-percent"> ₹({invoice.service_charge_final})</span>
                  </span>
                </div>
              )}
              {invoice.delivery_charge > 0 && (
                <div className="summary-row">
                  <span>Delivery Charge</span>
                  <span>
                    ₹{invoice.delivery_charge}
                  </span>
                </div>
              )}

              {invoice.discount_amount > 0 && (
                <div className="summary-row">
                  <span>Discount ({invoice.discount_percentage}%)</span>
                  <span>₹{invoice.discount_amount}</span>
                </div>
              )}

              <div className="summary-row total">
                <span>Grand Total</span>
                <span className="view-invoice-final-amount">₹{invoice.final_amount}</span>
              </div>
            </div>
          </section>


          <footer className="invoice-footer">
            <p>Thank you !</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default InvoiceViewPage;
