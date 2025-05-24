'use client';
import React from 'react';
import { useFetchCompanyDetailsQuery } from '@/slices/company/companyApi';

function CompanyDetails() {
  const { data, isLoading, isError } = useFetchCompanyDetailsQuery();

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p>Something went wrong</p>;

  const { company, subscribed_package, related_packages } = data;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Company Details</h1>
      <div className="border p-3 rounded bg-white shadow">
        <p><strong>Company Name:</strong> {company.company_name}</p>
        <p><strong>Company ID:</strong> {company.company_id}</p>
        <p><strong>Subscription Status:</strong> {company.subscription_status}</p>
      </div>

      <h2 className="text-xl font-semibold mt-6">Subscribed Package</h2>
      <div className="border p-3 rounded bg-green-50 shadow">
        <p><strong>Name:</strong> {subscribed_package.name}</p>
        <p><strong>Type:</strong> {subscribed_package.package_type}</p>
        <p><strong>Price:</strong> ₹{subscribed_package.price}</p>
        <p><strong>Invoices Allowed:</strong> {subscribed_package.invoices_number}</p>
      </div>

      <h2 className="text-xl font-semibold mt-6">Other Available Packages</h2>
      <ul className="space-y-2">
        {related_packages.map((pkg) => (
          <li key={pkg.id} className="border p-3 rounded bg-gray-50">
            <p><strong>{pkg.name}</strong> — ₹{pkg.price} ({pkg.package_type})</p>
            <p>Invoices: {pkg.invoices_number}, Items: {pkg.items_number}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CompanyDetails;
