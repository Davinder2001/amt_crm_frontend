'use client';
import React from 'react';
import { useFetchPackagesQuery } from '@/slices/superadminSlices/packages/packagesApi'; // Import the hook

const PackagesView = () => {
  // Fetch packages data
  const { data, error, isLoading } = useFetchPackagesQuery();

  console.log(data);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading packages.</div>;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      <h1>Packages</h1>
      {data?.map((packageItem: any) => (
        <div
          key={packageItem.id}
          style={{
            width: '250px',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fff',
          }}
        >
          <h3 style={{ textAlign: 'center', color: '#333' }}>{packageItem.name}</h3>
          <div style={{ marginBottom: '10px' }}>
            <p><strong>Employees:</strong> {packageItem.employee_numbers}</p>
            <p><strong>Items:</strong> {packageItem.items_number}</p>
            <p><strong>Daily Tasks:</strong> {packageItem.daily_tasks_number}</p>
            <p><strong>Invoices:</strong> {packageItem.invoices_number}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PackagesView;
