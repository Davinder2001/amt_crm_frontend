import { useGetCashPaymentHistoryQuery } from '@/slices/invoices/invoice';
import React from 'react';

export default function CashPayments() {
  const { data, error, isLoading } = useGetCashPaymentHistoryQuery();

  if (isLoading) return <div>Loading cash payments...</div>;
  if (error) return <div>Error loading cash payments</div>;

  return (
    <div>
      {data?.data.map((group) => (
        <div key={group.date} style={{ marginBottom: 20 }}>
          <h3>Date: {group.date}</h3>
          <p>Total: {group.total}</p>
          <ul>
            {group.transactions.map((t, idx) => (
              <li key={idx}>
                Invoice#: {t.invoice_number}, Amount: {t.amount}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
