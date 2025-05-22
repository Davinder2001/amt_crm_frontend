'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { usePayCreditInvoiceMutation, useGetCreditInvoiceByIdQuery } from '@/slices/invoices/invoice';
import { toast } from 'react-toastify';

const PayCreditForm: React.FC = () => {
    const params = useParams();
    const id = Number(params?.id);

    const { data, isLoading: isFetching } = useGetCreditInvoiceByIdQuery(id);
    const [payCreditInvoice, { isLoading: isPaying }] = usePayCreditInvoiceMutation();
    const [amount, setAmount] = useState<number>(0);
    const [note, setNote] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || amount <= 0) {
            toast.error('Please enter a valid amount.');
            return;
        }

        try {
            const res = await payCreditInvoice({ id, amount, note }).unwrap();
            toast.success(res.message || 'Payment successful!');
            setAmount(0);
            setNote('');
        } catch (error: any) {
            toast.error(error?.data?.message || 'Payment failed');
        }
    };

    const customer = data?.customer;

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-lg font-bold mb-4">Pay Credit for Customer #{customer?.id}</h2>

            {isFetching ? (
                <p>Loading credit details...</p>
            ) : customer ? (
                <>
                    <div className="mb-4 text-sm text-gray-700">
                        <p><strong>Customer :</strong> {customer.name}</p>
                        <p><strong>Number :</strong> {customer.number}</p>
                    </div>

                    <table className="w-full text-sm mb-4 border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-3 py-2 text-left">Sr No</th>
                                <th className="border px-3 py-2 text-left">Invoice Number</th>
                                <th className="border px-3 py-2 text-left">Date</th>
                                <th className="border px-3 py-2 text-right">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customer.credits.map((credit: any, index: number) => (
                                <tr key={index}>
                                    <td className="border px-3 py-2">{index + 1}</td>
                                    <td className="border px-3 py-2">{credit.invoice_number}</td>
                                    <td className="border px-3 py-2">{credit.invoice_date}</td>
                                    <td className="border px-3 py-2 text-right">{credit.final_amount}</td>
                                </tr>
                            ))}
                            <tr className="font-bold bg-gray-50">
                                <td colSpan={3} className="px-3 py-2 text-right">Total Due:</td>
                                <td className="px-3 py-2 text-right">₹{customer.total_due}</td>
                            </tr>
                        </tbody>
                    </table>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block font-semibold">Amount (₹)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-semibold">Note (optional)</label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                                rows={3}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isPaying}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            {isPaying ? 'Processing...' : 'Submit Payment'}
                        </button>
                    </form>
                </>
            ) : (
                <p className="text-red-500">Credit data not found.</p>
            )}
        </div>
    );
};

export default PayCreditForm;