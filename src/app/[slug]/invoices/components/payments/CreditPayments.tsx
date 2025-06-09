import { useGetCreditPaymentHistoryQuery } from '@/slices/invoices/invoice';
import React from 'react';
export default function CreditPayments() {
  const { data, error, isLoading } = useGetCreditPaymentHistoryQuery();

  if (isLoading) return <div>Loading credit payments...</div>;
  if (error) return <div>Error loading credit payments</div>;

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
