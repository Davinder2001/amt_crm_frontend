'use client';

import React, { useState } from 'react';
import { useFetchAdminBillingQuery } from '@/slices/paymentsAndBillings/payBillApi';
import Modal from '@/components/common/Modal';

const BillingSection = () => {
  const { data, isLoading, error } = useFetchAdminBillingQuery();
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);

  const [refundForm, setRefundForm] = useState({
    refund_title: '',
    refund_description: ''
  });

  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('refund_title', refundForm.refund_title);
    formData.append('refund_description', refundForm.refund_description);

    try {
      const response = await fetch('/api/refund', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to submit refund');

      console.log('Refund submitted:', refundForm);
      setIsRefundModalOpen(false);
      setRefundForm({ refund_title: '', refund_description: '' });
    } catch (err) {
      console.error(err);
    }
  };

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
                <th className="p-2 border">Action</th>
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
                  <td className="p-2 border"><button className='buttons' onClick={() => setIsRefundModalOpen(true)}>Refund</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No billing records found.</p>
      )}
      {/* Add Task Modal */}
      <Modal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        title="Refund"
        width="400px"
      >
        <form onSubmit={handleRefundSubmit} className="space-y-4">
          <div>
            <label htmlFor="refund_title" className="block text-sm font-medium text-gray-700">Refund Title</label>
            <input
              type="text"
              id="refund_title"
              name="refund_title"
              value={refundForm.refund_title}
              onChange={(e) =>
                setRefundForm({ ...refundForm, refund_title: e.target.value })
              }
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="refund_description" className="block text-sm font-medium text-gray-700">Refund Description</label>
            <textarea
              id="refund_description"
              name="refund_description"
              rows={4}
              value={refundForm.refund_description}
              onChange={(e) =>
                setRefundForm({ ...refundForm, refund_description: e.target.value })
              }
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Submit Refund Request
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BillingSection;
