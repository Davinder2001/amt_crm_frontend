'use client';
import { useFetchAllCustomersQuery } from '@/slices/customers/customer';
import React from 'react';
import { FaEye } from 'react-icons/fa'; // Import the 'eye' icon for view action

const CustomerList = () => {
  const { data } = useFetchAllCustomersQuery();

  return (
    <div>
      <h1>All Customers</h1>
      <table cellPadding="10" cellSpacing="0" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.customers?.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.number}</td>
              <td>
                <button onClick={() => alert(`Viewing customer ${customer.name}`)}>
                  <FaEye /> View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;
