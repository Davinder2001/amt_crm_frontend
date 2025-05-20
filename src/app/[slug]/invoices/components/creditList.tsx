'use client';
import React from 'react';
import { useGetCreditUsersQuery } from '@/slices/invoices/invoice';
import { useRouter } from 'next/navigation';

const CreditList = () => {
  const { data, isLoading, isError } = useGetCreditUsersQuery();
  const router = useRouter();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong.</p>;

  const handleView = (userId: number) => {
    router.push(`credits/view/${userId}`);
  };

  const handlePay = (userId: number) => {
    router.push(`credits/pay/${userId}`);
  };

  return (
    <div className="table-container">
      <h2 className="heading">Credit Users</h2>
      <table className="table">
        <thead className="thead">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Total Invoices</th>
            <th>Total Due (₹)</th>
            <th>Paid (₹)</th>
            <th>Outstanding (₹)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="tbody">
          {data?.data?.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.number}</td>
              <td>{user.total_invoices}</td>
              <td>{user.total_due}</td>
              <td>{user.amount_paid}</td>
              <td>{user.outstanding}</td>
              <td>
                <button className="btn view-btn" onClick={() => handleView(user.customer_id)}>
                  View
                </button>
                <button className="btn pay-btn" onClick={() => handlePay(user.customer_id)}>
                  Pay
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CreditList;
