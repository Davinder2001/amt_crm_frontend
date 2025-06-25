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

import React, { useState } from 'react';
import { useFetchCompanyDetailsQuery } from '@/slices/company/companyApi';
import {
  useFetchPackagesQuery,
  useUpgradeCompanyPackageMutation
} from '@/slices/superadminSlices/packages/packagesApi';
import Modal from '@/components/common/Modal';

function CompanyDetails() {
  const { data, isLoading, isError } = useFetchCompanyDetailsQuery();
  const { data: allPlans = [] } = useFetchPackagesQuery();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeCompanyPackage] = useUpgradeCompanyPackageMutation();

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p>Something went wrong.</p>;

  const { company, subscribed_package } = data;

  const handleUpgrade = async (packageId: number, packageType: 'monthly' | 'annual') => {
    try {
      const payload = {
        companyId: company.id,
        package_id: packageId,
        package_type: packageType,
      };
      console.log('Sending Payload:', payload);
      await upgradeCompanyPackage(payload).unwrap();
      alert('Package upgraded successfully!');
      setShowUpgradeModal(false);
    } catch (error) {
      console.error('Upgrade failed:', error);
      alert('Failed to upgrade package.');
    }
  };

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
        <p><strong>Annual Price:</strong> ₹{subscribed_package.annual_price}</p>
        <p><strong>Monthly Price:</strong> ₹{subscribed_package.monthly_price}</p>
        <p><strong>Employees Allowed:</strong> {subscribed_package.employee_numbers}</p>
        <p><strong>Items Allowed:</strong> {subscribed_package.items_number}</p>
        <p><strong>Daily Tasks:</strong> {subscribed_package.daily_tasks_number}</p>
        <p><strong>Invoices Allowed:</strong> {subscribed_package.invoices_number}</p>

        <button onClick={() => setShowUpgradeModal(true)}>Upgrade</button>

        {showUpgradeModal && (
          <Modal
            isOpen={showUpgradeModal}
            onClose={() => setShowUpgradeModal(false)}
            title="Upgrade Plan"
            width="700px"
          >
            <div className="packages-grid">
              {allPlans
                .filter(plan => plan.name === subscribed_package.name)
                .flatMap((plan) => {
                  const currentMonthlyPrice = subscribed_package.monthly_price;

                  const packagesToRender = [];

                  if (parseFloat(String(plan.monthly_price)) > 0) {
                    const isCurrent = subscribed_package.id === plan.id && company.subscription_type === 'monthly';
                    const isEligible = parseFloat(String(plan.monthly_price)) > currentMonthlyPrice;

                    packagesToRender.push({
                      id: `${plan.id}-monthly`,
                      type: 'monthly',
                      price: plan.monthly_price,
                      isCurrent,
                      isEligible,
                      originalPlan: plan,
                    });
                  }

                  if (parseFloat(String(plan.annual_price)) > 0) {
                    const isCurrent = subscribed_package.id === plan.id && company.subscription_type === 'annual';
                    const isEligible = parseFloat(String(plan.annual_price)) > currentMonthlyPrice;

                    packagesToRender.push({
                      id: `${plan.id}-annual`,
                      type: 'annual',
                      price: plan.annual_price,
                      isCurrent,
                      isEligible,
                      originalPlan: plan,
                    });
                  }

                  return packagesToRender;
                })
                .map((pkg) => (
                  <div key={pkg.id} className="package-card">
                    <h3>{pkg.originalPlan.name} ({pkg.type})</h3>
                    <p className="price">₹{pkg.price}</p>

                    <span className={`badge ${pkg.isCurrent
                      ? 'badge-current'
                      : pkg.isEligible
                        ? 'badge-upgrade'
                        : 'badge-disabled'
                      }`}>
                      {pkg.isCurrent
                        ? 'Current Plan'
                        : pkg.isEligible
                          ? 'Upgrade Available'
                          : 'Not Eligible'}
                    </span>

                    <button
                      className={`upgrade-button ${pkg.isEligible
                        ? 'btn-upgrade'
                        : pkg.isCurrent
                          ? 'btn-current'
                          : 'btn-disabled'
                        }`}
                      disabled={!pkg.isEligible && !pkg.isCurrent}
                      onClick={() => handleUpgrade(pkg.originalPlan.id ?? 0, pkg.type as 'monthly' | 'annual')}
                    >
                      {pkg.isCurrent
                        ? 'Current Plan (Click to Re-Submit)'
                        : pkg.isEligible
                          ? 'Upgrade'
                          : 'Not Eligible'}
                    </button>
                  </div>
                ))}
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default CompanyDetails;
