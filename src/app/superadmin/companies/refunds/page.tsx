'use client';
import React, { useState } from 'react';
import {
    useFetchRefundsQuery,
    useApproveRefundMutation,
    useCompleteRefundMutation,
    useDeclineRefundMutation,
} from '@/slices/superadminSlices/payments/paymentApi';

function Refunds() {
    const { data, isLoading, isError } = useFetchRefundsQuery();
    const [approveRefund] = useApproveRefundMutation();
    const [completeRefund] = useCompleteRefundMutation();
    const [declineRefund] = useDeclineRefundMutation();
    const [declineModal, setDeclineModal] = useState<{ show: boolean; id: string | null }>({ show: false, id: null });
    const [declineReason, setDeclineReason] = useState('');

    const handleApprove = async (id: string) => {
        await approveRefund(id);
    };

    const handleComplete = async (id: string) => {
        await completeRefund(id);
    };

    const handleDeclineSubmit = async () => {
        if (declineModal.id) {
            await declineRefund({ transactionId: declineModal.id, reason: declineReason });
            setDeclineModal({ show: false, id: null });
            setDeclineReason('');
        }
    };

    if (isLoading) return <p>Loading refunds...</p>;
    if (isError) return <p>Error loading refunds.</p>;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Refund Requests</h1>
            {data?.data.length === 0 ? (
                <p>No refund requests found.</p>
            ) : (
                <table className="w-full border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-4 py-2">Transaction ID</th>
                            <th className="border px-4 py-2">User ID</th>
                            <th className="border px-4 py-2">Amount</th>
                            <th className="border px-4 py-2">Status</th>
                            <th className="border px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.data.map((refund: RefundRequest) => (
                            <tr key={refund.transaction_id}>
                                <td className="border px-4 py-2">{refund.transaction_id}</td>
                                <td className="border px-4 py-2">{refund.user_id}</td>
                                <td className="border px-4 py-2">${refund.amount}</td>
                                <td className="border px-4 py-2">{refund.refund}</td>
                                <td className="border px-4 py-2 space-x-2">
                                    {refund.refund === 'refund_processed' && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(refund.transaction_id)}
                                                className="bg-blue-500 text-white px-2 py-1 rounded"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => setDeclineModal({ show: true, id: refund.transaction_id })}
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                            >
                                                Decline
                                            </button>
                                        </>
                                    )}
                                    {refund.refund === 'refund_approved' && (
                                        <button
                                            onClick={() => handleComplete(refund.transaction_id)}
                                            className="bg-green-500 text-white px-2 py-1 rounded"
                                        >
                                            Complete
                                        </button>
                                    )}
                                    {refund.refund === 'refund_declined' && (
                                        <span className="text-red-600 text-sm">Declined: {refund.decline_reason}</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Decline Modal */}
            {declineModal.show && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Decline Refund</h2>
                        <textarea
                            className="w-full border px-2 py-1 mb-4"
                            placeholder="Reason for decline..."
                            value={declineReason}
                            onChange={(e) => setDeclineReason(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setDeclineModal({ show: false, id: null })}
                                className="px-4 py-2 bg-gray-300 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeclineSubmit}
                                className="px-4 py-2 bg-red-600 text-white rounded"
                            >
                                Decline
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Refunds;
