'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { usePayCreditInvoiceMutation, useGetCreditInvoiceByIdQuery } from '@/slices/invoices/invoice';
import { toast } from 'react-toastify';

const PayCreditForm: React.FC = () => {
    const params = useParams();
    const id = Number(params?.id);

    type CustomerCredit = {
        id: number;
        name: string;
        number: string;
        credits: {
            invoice_number: string;
            invoice_date: string;
            final_amount: number;
        }[];
        total_due: number;
    };

    type CreditInvoiceResponse = {
        status: boolean;
        message: string;
        customer?: CustomerCredit;
    };

    const { data, isLoading: isFetching } = useGetCreditInvoiceByIdQuery(id) as { data: CreditInvoiceResponse, isLoading: boolean };
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
        } catch {
            toast.error('Payment failed');
        }
    };

    const customer = data?.customer;

    return (
        <div className="pay-credit-container">
            <h2 className="pay-credit-header">Pay Credit for Customer #{customer?.id}</h2>

            {isFetching ? (
                <p className="loading-text">Loading credit details...</p>
            ) : customer ? (
                <>
                    <div className="customer-info">
                        <p><strong>Customer :</strong> {customer.name}</p>
                        <p><strong>Number :</strong> {customer.number}</p>
                    </div>

                    <table className="credit-table">
                        <thead className="credit-table-header">
                            <tr>
                                <th className="credit-table-cell credit-table-cell--left">Sr No</th>
                                <th className="credit-table-cell credit-table-cell--left">Invoice Number</th>
                                <th className="credit-table-cell credit-table-cell--left">Date</th>
                                <th className="credit-table-cell credit-table-cell--right">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customer.credits.map((credit, index: number) => (
                                <tr key={index} className="credit-row">
                                    <td className="credit-table-cell">{index + 1}</td>
                                    <td className="credit-table-cell">{credit.invoice_number}</td>
                                    <td className="credit-table-cell">{credit.invoice_date}</td>
                                    <td className="credit-table-cell credit-table-cell--right">{credit.final_amount}</td>
                                </tr>
                            ))}
                            <tr className="total-due-row">
                                <td colSpan={3} className="credit-table-cell credit-table-cell--right total-due-label">Total Due:</td>
                                <td className="credit-table-cell credit-table-cell--right total-due-amount">₹{customer.total_due}</td>
                            </tr>
                        </tbody>
                    </table>

                    <form onSubmit={handleSubmit} className="payment-form">
                        <div className="form-group">
                            <label className="form-label">Amount (₹)</label>
                            <input
                                type="number"
                                value={amount}
                                onFocus={() => amount === 0 && setAmount(NaN)}
                                onBlur={() => isNaN(amount) && setAmount(0)}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="form-input"
                                required
                            />

                        </div>

                        <div className="form-group">
                            <label className="form-label">Note (optional)</label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="form-textarea"
                                rows={3}
                            />
                        </div>

                        <div className='Payment-submit-btn-outer'>
                            <button
                                type="submit"
                                disabled={isPaying}
                                className="submit-button"
                            >
                                {isPaying ? 'Processing...' : 'Submit Payment'}
                            </button>
                        </div>
                    </form>
                </>
            ) : (
                <p className="error-text">Credit data not found.</p>
            )}
        </div>
    );
};

export default PayCreditForm;
