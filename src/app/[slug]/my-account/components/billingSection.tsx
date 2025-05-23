'use client';

import React from 'react';
import { useFetchAdminBillingQuery } from '@/slices/paymentsAndBillings/payBillApi';

const BillingSection = () => {
  const { data, isLoading, error } = useFetchAdminBillingQuery();

  if (isLoading) {
    return (
      <div className="p-4">
        <p className="text-gray-600">Loading billing data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">Failed to load billing data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Billing History</h2>
      {Array.isArray(data?.payments) && data.payments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Sr. No.</th>
                <th className="p-2 border">Transaction ID</th>
                <th className="p-2 border">Amount (₹)</th>
                <th className="p-2 border">Method</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Time</th>
              </tr>
            </thead>
            <tbody>
              {data.payments.map((payment: Payment, index: number) => (
                <tr key={payment.id} className="text-center">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">{payment.transaction_id}</td>
                  <td className="p-2 border">{payment.transaction_amount}</td>
                  <td className="p-2 border">{payment.payment_method}</td>
                  <td className="p-2 border">{payment.payment_status}</td>
                  <td className="p-2 border">{payment.payment_date}</td>
                  <td className="p-2 border">{payment.payment_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No billing records found.</p>
      )}
    </div>
  );
};

export default BillingSection;
