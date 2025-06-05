'use client';

import React, { useState } from 'react';
import {
  useFetchAdminBillingQuery,
  useCreateRefundMutation,
} from '@/slices/paymentsAndBillings/payBillApi';
import Modal from '@/components/common/Modal';

const BillingSection = () => {
  const { data, isLoading, error } = useFetchAdminBillingQuery();
  const [createRefund] = useCreateRefundMutation();

  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTransactionId) return;

    try {
      const formdata = new FormData();
      formdata.append('reason', reason);
      await createRefund({ transaction_id: selectedTransactionId, formdata }).unwrap();
      console.log('Refund submitted for transaction:', selectedTransactionId);
      setIsRefundModalOpen(false);
      setSelectedTransactionId(null);
      setReason('');
    } catch (err) {
      console.error('Failed to submit refund:', err);
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
                  <td className="p-2 border">
                    <button
                      className="buttons"
                      onClick={() => {
                        setSelectedTransactionId(payment.transaction_id);
                        setIsRefundModalOpen(true);
                      }}
                    >
                      Refund
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No billing records found.</p>
      )}

      {/* Refund Modal */}
      <Modal
        isOpen={isRefundModalOpen}
        onClose={() => {
          setIsRefundModalOpen(false);
          setSelectedTransactionId(null);
          setReason('');
        }}
        title="Submit Refund Request"
        width="400px"
      >
        <form onSubmit={handleRefundSubmit} className="space-y-4">
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
              Reason for Refund
            </label>
            <textarea
              id="reason"
              name="reason"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BillingSection;
