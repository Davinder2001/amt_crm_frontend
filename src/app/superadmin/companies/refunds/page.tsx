'use client';

import React, { useState } from 'react';
import {
    useFetchRefundsQuery,
    useApproveRefundMutation,
    useCompleteRefundMutation,
    useDeclineRefundMutation,
} from '@/slices/superadminSlices/payments/paymentApi';
import Modal from '@/components/common/Modal';

const Refunds = () => {
    const { data, isLoading, isError } = useFetchRefundsQuery();
    const [approveRefund] = useApproveRefundMutation();
    const [completeRefund] = useCompleteRefundMutation();
    const [declineRefund] = useDeclineRefundMutation();

    const [declineModalOpen, setDeclineModalOpen] = useState(false);
    const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
    const [declineReason, setDeclineReason] = useState('');

    const openDeclineModal = (id: string) => {
        setSelectedTransactionId(id);
        setDeclineModalOpen(true);
    };

    const closeDeclineModal = () => {
        setSelectedTransactionId(null);
        setDeclineReason('');
        setDeclineModalOpen(false);
    };

    const handleApprove = async (id: string) => {
        await approveRefund(id);
    };

    const handleComplete = async (id: string) => {
        await completeRefund(id);
    };

    const handleDecline = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTransactionId) return;

        await declineRefund({ transactionId: selectedTransactionId, reason: declineReason });
        closeDeclineModal();
    };

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error loading refunds.</p>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Refund Requests</h1>
            {data?.data.length === 0 ? (
                <p>No refund requests available.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border">Transaction ID</th>
                                <th className="p-2 border">User ID</th>
                                <th className="p-2 border">Amount</th>
                                <th className="p-2 border">Status</th>
                                <th className="p-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.data.map((refund: RefundRequest) => (
                                <tr key={refund.transaction_id}>
                                    <td className="p-2 border">{refund.transaction_id}</td>
                                    <td className="p-2 border">{refund.user_id}</td>
                                    <td className="p-2 border">${refund.amount}</td>
                                    <td className="p-2 border">{refund.refund}</td>
                                    <td className="p-2 border space-x-2" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        {refund.refund === 'request processed' && (
                                            <>
                                                <button
                                                    type='submit'
                                                    className="buttons"
                                                    onClick={() => handleApprove(refund.transaction_id)}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    type='submit'
                                                    className="buttons"
                                                    onClick={() => openDeclineModal(refund.transaction_id)}
                                                >
                                                    Decline
                                                </button>
                                            </>
                                        )}

                                        {refund.refund === 'refund approved' && (
                                            <button
                                                type='submit'
                                                className="buttons"
                                                onClick={() => handleComplete(refund.transaction_id)}
                                            >
                                                Complete
                                            </button>
                                        )}

                                        {refund.refund === 'refund declined' && (
                                            <span className="text-red-600 text-xs">
                                                Declined: {refund.decline_reason}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Reusable Decline Refund Modal */}
            <Modal
                isOpen={declineModalOpen}
                onClose={closeDeclineModal}
                title="Decline Refund Request"
                width="400px"
            >
                <form onSubmit={handleDecline} className="space-y-4">
                    <div>
                        <label htmlFor="decline-reason" className="block text-sm font-medium text-gray-700">
                            Reason for Decline
                        </label>
                        <textarea
                            id="decline-reason"
                            className="w-full border px-3 py-2 rounded-md"
                            rows={4}
                            value={declineReason}
                            onChange={(e) => setDeclineReason(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={closeDeclineModal}
                            className="buttons"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="buttons">
                            Decline
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Refunds;
