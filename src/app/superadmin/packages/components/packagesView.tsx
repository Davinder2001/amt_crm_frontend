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
          <FaPlus/> Create New Package
        </button>
      </div>

      <div className="packages-grid">
        {data && data.map((plan) => (
          <div key={plan.id} className="package-card">
            <div className="ribbon">1 Year</div>
            <h3 className="title">₹ {plan.price ?? 0} / Year</h3>
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
        ))}
      </div>
    </div>
  );
};

export default PackagesView;
