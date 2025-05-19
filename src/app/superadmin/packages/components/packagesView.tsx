'use client';
import React from 'react';
import { useFetchPackagesQuery } from '@/slices/superadminSlices/packages/packagesApi';
import Loader from '@/components/common/Loader';
import { useRouter } from 'next/navigation';
import { FaPlus } from 'react-icons/fa';

const PackagesView = () => {
  const { data, error, isLoading } = useFetchPackagesQuery();
  const router = useRouter();

  if (isLoading) return <Loader />;
  if (error) return <div className="error-message">Error loading packages.</div>;

  return (
    <div className="superadmin-packages-container">
      <div className="header">
        <h2>Pick Your Perfect Plan</h2>
        <button onClick={() => router.push('/superadmin/packages/create')} className='buttons'>
          <FaPlus /> Create New Package
        </button>
      </div>

      <div className="packages-grid">
        {Array.isArray(data) && data.length > 0 ?
          (data.map((plan) => {
            return <div key={plan.id} className="package-card">
              <div className="ribbon">1 Year</div>
              <h3 className="planPrice">₹ {plan.price ?? 0} / Year</h3>
              <ul className="features">
                <li>👥 {plan.employee_numbers} Employees</li>
                <li>📦 {plan.items_number} Items</li>
                <li>📋 {plan.daily_tasks_number} Tasks/day</li>
                <li>🧾 {plan.invoices_number} Invoices</li>
              </ul>
              {plan.business_categories?.length > 0 && (
                <div className="categories">
                  <h4>Business Categories</h4>
                  <ul>
                    {plan.business_categories.map((category) => (
                      <li key={category.id}>{category.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          })) : (
            <div className="no-packages-message">
              <div className="empty-box-icon">📦</div>
              <h3>No packages available</h3>
              <p>We couldn't find any packages for this category.</p>
              <div className="suggestions">
                <p>Try selecting a different category or check back later!</p>
                <div className="wave-hand">👋</div>
              </div>
            </div>
          )}

      </div>
    </div>
  );
};

export default PackagesView;
