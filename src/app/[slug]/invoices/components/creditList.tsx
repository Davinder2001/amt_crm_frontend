'use client';
import React from 'react';
import { useGetCreditUsersQuery } from '@/slices/invoices/invoice';

const CreditList = () => {
  const { data, isLoading, isError } = useGetCreditUsersQuery();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong.</p>;

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Credit Users</h2>
      <table className="min-w-full border border-gray-200 rounded-md shadow-sm text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">#</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Phone</th>
            <th className="px-4 py-2 border">Total Invoices</th>
            <th className="px-4 py-2 border">Total Due (₹)</th>
            <th className="px-4 py-2 border">Paid (₹)</th>
            <th className="px-4 py-2 border">Outstanding (₹)</th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.map((user, index) => (
            <tr key={index} className="text-center">
              <td className="px-4 py-2 border">{index + 1}</td>
              <td className="px-4 py-2 border">{user.name}</td>
              <td className="px-4 py-2 border">{user.number}</td>
              <td className="px-4 py-2 border">{user.total_invoices}</td>
              <td className="px-4 py-2 border">{user.total_due}</td>
              <td className="px-4 py-2 border">{user.amount_paid}</td>
              <td className="px-4 py-2 border">{user.outstanding}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CreditList;
