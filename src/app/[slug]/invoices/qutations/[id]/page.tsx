'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { useGetQuotationByIdQuery } from '@/slices/quotation/quotationApi';
import { motion } from 'framer-motion';
import { FaClipboardList } from 'react-icons/fa';
import Link from 'next/link';
import { useCompany } from '@/utils/Company';
import { FaArrowLeft } from 'react-icons/fa';

const QuotationPage = () => {
  const params = useParams();
  const rawId = params?.id;
  const id = rawId ? Number(rawId) : undefined;
  const { companySlug } = useCompany();

  const { data: quotation, isLoading, isError } = useGetQuotationByIdQuery(id!, {
    skip: !id || isNaN(id),
  });

  if (isLoading) return <p className="invoice-loading">Loading...</p>;
  if (isError || !quotation) return <p className="invoice-error">Something went wrong while fetching quotation.</p>;

  return (
    <motion.div
      className="quotation-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div><Link href={`/${companySlug}/invoices/qutations`} className='back-button'>
        <FaArrowLeft size={20} color='#fff' />
      </Link></div>
      <div className="quotation-card">
        <div className="quotation-header">
          <h1><FaClipboardList style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Quotation</h1>
          <div className="quotation-dates">
            <span><strong>Created:</strong> {new Date(quotation.created_at).toISOString().split('T')[0]}</span>
            <span><strong>Updated:</strong> {new Date(quotation.updated_at).toISOString().split('T')[0]}</span>
          </div>
        </div>

        <motion.div
          className="client-info"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="company-name">{quotation.company_name}</p>
          <p><strong>Name:</strong> {quotation.customer_name}</p>
          <p><strong>Phone:</strong> {quotation.customer_number}</p>
          <p><strong>Email:</strong> {quotation.customer_email}</p>
        </motion.div>

        <div className="quotation-items">
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
                  <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="quotation-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{quotation.sub_total}</span>
          </div>
          <div className="summary-row">
            <span>Tax ({quotation.tax_percent}%)</span>
            <span>₹{quotation.tax_amount}</span>
          </div>
          <div className="summary-row">
            <span>Service Charges</span>
            <span>₹{quotation.service_charges}</span>
          </div>
          <div className="summary-row total">
            <span>Grand Total</span>
            <span className='quotation-grand-total'>₹{quotation.total}</span>
          </div>
        </div>

        <div className="quotation-footer">
          <p>Thank you!</p>
        </div>
      </div>
    </motion.div>
  );
};

export default QuotationPage;
