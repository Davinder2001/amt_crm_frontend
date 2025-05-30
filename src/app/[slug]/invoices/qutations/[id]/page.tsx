'use client';
import React from 'react';
import { useGetAllQuotationsQuery } from '@/slices/quotation/quotationApi';

const QuotationPage = () => {
  const { data, isLoading, isError } = useGetAllQuotationsQuery();

  if (isLoading) return <p className="invoice-loading">Loading...</p>;
  if (isError) return <p className="invoice-error">Something went wrong while fetching quotations.</p>;

  return (
    <div className="invoice-wrapper">
      <div className="invoice-card">
        <div className="invoice-header">
          <div className="invoice-title">
            <h1>Quotation</h1>
          </div>
          <div className="invoice-date">Date: {new Date().toISOString().split('T')[0]}</div>
        </div>

        {data?.map((quotation) => (
          <div key={quotation.id} className="quotation-block">
            <div className="invoice-info">
              <div className="client-section">
                <p><strong>{quotation.company_name}</strong></p>
                <p><strong>Name:</strong> {quotation.customer_name}</p>
                <p><strong>Phone:</strong> {quotation.customer_number}</p>
                <p><strong>Email:</strong> {quotation.customer_email}</p>
              </div>
            </div>

            <div className="invoice-items">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {quotation.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{item.name}</td>
                      <td>₹{item.price.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="invoice-summary-outer">
              <div className="invoice-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹</span>
                </div>
                <div className="summary-row">
                  <span>Tax ({quotation.tax_percent}%)</span>
                  <span>₹{quotation.tax_amount}</span>
                </div>
                <div className="summary-row">
                  <span>Service Charges</span>
                  <span className="service-charge-percent">₹{quotation.service_charges}</span>
                </div>
                <div className="summary-row total">
                  <span>Grand Total</span>
                  <span className="view-invoice-final-amount">₹{quotation.total}</span>
                </div>
              </div>
            </div>

            <div className="invoice-footer">
              <p>Thank you!</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuotationPage;
