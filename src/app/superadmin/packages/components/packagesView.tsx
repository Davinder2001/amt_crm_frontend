'use client';
import React from 'react';
import { useFetchPackagesQuery } from '@/slices/superadminSlices/packages/packagesApi';
import Loader from '@/components/common/Loader';
import { useRouter } from 'next/navigation';
const PackagesView = () => {
  // Fetch packages data using RTK Query hook
  const { data, error, isLoading } = useFetchPackagesQuery();
  const router = useRouter();

  if (isLoading) return <Loader />;
  if (error) return <div>Error loading packages.</div>;

  return (
    <div className="pricing-container">
      <div className="outer-div">
        <h2 className="price-heading">Pick Your Perfect Plan</h2>
        <button onClick={() => router.push(`/superadmin/packages/create`)} className='buttons'>Create new package</button>
        <div className="plans">
          {/* Render the plans */}
          {data && data.map((plan) => (
            <div key={plan.id} className="planCard">
              <h3 className="planTitle">1 Year Plan</h3>
              <p className="planPrice">₹ {plan.price ?? 0} / Year</p>
              <ul className="features">
                <li>✓ {plan.employee_numbers} Employees</li>
                <li>✓ {plan.items_number} Items</li>
                <li>✓ {plan.daily_tasks_number} Tasks/day</li>
                <li>✓ {plan.invoices_number} Invoices</li>
              </ul>
              {/* Render business categories */}
              {plan.business_categories && plan.business_categories.length > 0 && (
                <div className="business-categories">
                  <h4>Business Categories</h4>
                  <ul>
                    {plan.business_categories.map((category) => (
                      <li key={category.id}>
                        {category.name} {category.name && `- ${category.name}`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PackagesView;
