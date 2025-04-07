'use client'
import React from 'react';
import Link from 'next/link';
import { useFetchVendorsQuery } from '@/slices/vendor/vendorApi';
import { useCompany } from '@/utils/Company';

const Page: React.FC = () => {
  const { data: vendors, error, isLoading } = useFetchVendorsQuery();
  const { companySlug } = useCompany();

  return (
    <div>
      <h1>Vendors</h1>
      {isLoading ? (
        <p>Loading vendors...</p>
      ) : error ? (
        <p>Error fetching vendors.</p>
      ) : vendors && vendors.length > 0 ? (
        <table border={1} cellPadding={8} cellSpacing={0}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Vendor Name</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor: Vendor) => (
              <tr key={vendor.id}>
                <td>{vendor.id}</td>
                <td>{vendor.vendor_name}</td>
                <td>{vendor.created_at}</td>
                <td>{vendor.updated_at}</td>
                <td>
                  <Link href={`/${companySlug}/store/vendors/${vendor.id}`}>
                    <button>View</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No vendors found.</p>
      )}
    </div>
  );
};

export default Page;
