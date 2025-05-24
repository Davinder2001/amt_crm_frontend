// 'use client';
// import React from 'react';
// import { useFetchCompanyDetailsQuery } from '@/slices/company/companyApi';

// function CompanyDetails() {
//   const { data, isLoading, isError } = useFetchCompanyDetailsQuery();

//   if (isLoading) return <p>Loading...</p>;
//   if (isError || !data) return <p>Something went wrong</p>;

//   const { company, subscribed_package, related_packages } = data;

//   return (
//     <div className="p-4 space-y-4">
//       <h1 className="text-2xl font-bold">Company Details</h1>
//       <div className="border p-3 rounded bg-white shadow">
//         <p><strong>Company Name:</strong> {company.company_name}</p>
//         <p><strong>Company ID:</strong> {company.company_id}</p>
//         <p><strong>Subscription Status:</strong> {company.subscription_status}</p>
//       </div>

//       <h2 className="text-xl font-semibold mt-6">Subscribed Package</h2>
//       <div className="border p-3 rounded bg-green-50 shadow">
//         <p><strong>Name:</strong> {subscribed_package.name}</p>
//         <p><strong>Type:</strong> {subscribed_package.package_type}</p>
//         <p><strong>Price:</strong> ₹{subscribed_package.price}</p>
//         <p><strong>Invoices Allowed:</strong> {subscribed_package.invoices_number}</p>
//       </div>

//       <h2 className="text-xl font-semibold mt-6">Other Available Packages</h2>
//       <ul className="space-y-2">
//         {related_packages.map((pkg) => (
//           <li key={pkg.id} className="border p-3 rounded bg-gray-50">
//             <p><strong>{pkg.name}</strong> — ₹{pkg.price} ({pkg.package_type})</p>
//             <p>Invoices: {pkg.invoices_number}, Items: {pkg.items_number}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default CompanyDetails;













'use client';

import React from 'react';
import { useFetchCompanyDetailsQuery } from '@/slices/company/companyApi';


function CompanyDetails() {
  const { data, isLoading, isError } = useFetchCompanyDetailsQuery();

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p>Something went wrong.</p>;

  const { company, subscribed_package, related_packages } = data;

  return (
    <div className="company-details-container">
      <h1>Company Details</h1>

      <div className="card">
        <h2>General Info</h2>
        <p><strong>Name:</strong> {company.company_name}</p>
        <p><strong>Company ID:</strong> {company.company_id}</p>
        <p><strong>Slug:</strong> {company.company_slug}</p>
        <p><strong>Business Category ID:</strong> {company.business_category}</p>
        <p><strong>Subscription Status:</strong> {company.subscription_status}</p>
        <p><strong>Payment Status:</strong> {company.payment_status}</p>
        <p><strong>Verification Status:</strong> {company.verification_status}</p>
        <p><strong>Created At:</strong> {new Date(company.created_at).toLocaleString()}</p>
        <p><strong>Updated At:</strong> {new Date(company.updated_at).toLocaleString()}</p>
      </div>

      <div className="card green">
        <h2>Subscribed Package</h2>
        <p><strong>Name:</strong> {subscribed_package.name}</p>
        <p><strong>Type:</strong> {subscribed_package.package_type}</p>
        <p><strong>Price:</strong> ₹{subscribed_package.price}</p>
        <p><strong>Employees Allowed:</strong> {subscribed_package.employee_numbers}</p>
        <p><strong>Items Allowed:</strong> {subscribed_package.items_number}</p>
        <p><strong>Daily Tasks:</strong> {subscribed_package.daily_tasks_number}</p>
        <p><strong>Invoices Allowed:</strong> {subscribed_package.invoices_number}</p>
      </div>

      <div className="card gray">
        <h2>Other Available Packages</h2>
        {related_packages.map((pkg) => (
          <div key={pkg.id} className="package-item">
            <p><strong>Name:</strong> {pkg.name}</p>
            <p><strong>Type:</strong> {pkg.package_type}</p>
            <p><strong>Price:</strong> ₹{pkg.price}</p>
            <p><strong>Employees Allowed:</strong> {pkg.employee_numbers}</p>
            <p><strong>Items Allowed:</strong> {pkg.items_number}</p>
            <p><strong>Daily Tasks:</strong> {pkg.daily_tasks_number}</p>
            <p><strong>Invoices Allowed:</strong> {pkg.invoices_number}</p>
          </div>
        ))}
      </div>
        
    </div>
  );
}

export default CompanyDetails;
