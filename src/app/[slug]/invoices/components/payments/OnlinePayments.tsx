import { useGetOnlinePaymentHistoryQuery } from '@/slices/invoices/invoice';
import React from 'react';

export default function OnlinePayments() {
  const { data, error, isLoading } = useGetOnlinePaymentHistoryQuery();

  if (isLoading) return <div>Loading online payments...</div>;
  if (error) return <div>Error loading online payments</div>;

  return (
    <div>
      {data?.data.map((group) => (
        <div key={group.bank_account_id ?? 'no-id'} style={{ marginBottom: 20 }}>
          <h3>
            {group.bank_name} - {group.account_number}
          </h3>
          <p>Total transferred: {group.total_transferred}</p>
          <ul>
            {group.transactions.map((t, idx) => (
              <li key={idx}>
                Invoice#: {t.invoice_number}, Date: {t.invoice_date}, Amount: {t.amount}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
