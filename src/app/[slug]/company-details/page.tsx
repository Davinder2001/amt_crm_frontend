'use client';

import React, { useState } from 'react';
import { useFetchCompanyDetailsQuery } from '@/slices/company/companyApi';
import { useUpgradeCompanyPackageMutation } from '@/slices/superadminSlices/packages/packagesApi';
import Modal from '@/components/common/Modal';

interface PackagePlan {
  id: number;
  name: string;
  monthly_price: number;
  annual_price: number;
  three_years_price: number;
  employee_numbers: number;
  items_number: number;
  daily_tasks_number: number;
  invoices_number: number;
  business_categories: {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
  }[];
}

interface CompanyDetails {
  id: number;
  admin_id: number;
  company_id: string;
  company_name: string;
  company_slug: string;
  business_category: string | number;
  subscription_status: string;
  payment_status: string;
  verification_status: string;
  subscription_type: 'monthly' | 'annual' | 'three_years';
  created_at: string;
  updated_at: string;
}

interface CompanyDetailsResponse {
  company: CompanyDetails;
  subscribed_package: PackagePlan;
  related_packages: PackagePlan[];
}

interface ErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

function CompanyDetails() {
  const {
    data,
    isLoading,
    isError,
    refetch
  } = useFetchCompanyDetailsQuery(undefined);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackagePlan | null>(null);
  const [upgradeCompanyPackage] = useUpgradeCompanyPackageMutation();
  const [error, setError] = useState<ErrorResponse | null>(null);

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p>Something went wrong.</p>;

  const { company, subscribed_package, related_packages } = data as unknown as CompanyDetailsResponse;

  const handleUpgradeClick = (pkg: PackagePlan) => {
    setSelectedPackage(pkg);
    setShowUpgradeModal(true);
    setError(null);
  };

  const handlePackageUpgrade = async (subscriptionType: 'monthly' | 'annual' | 'three_years') => {
    try {
      if (!selectedPackage) {
        throw new Error('No package selected');
      }

      const formData = new FormData();
      formData.append("company_id", company.id.toString());
      formData.append("package_id", selectedPackage.id.toString());
      formData.append("package_type", subscriptionType);

      const response = await upgradeCompanyPackage(formData).unwrap();

      localStorage.setItem("upgradepackage", JSON.stringify({
        packageId: selectedPackage.id,
        packageType: subscriptionType,
      }));
      await refetch();
      setShowUpgradeModal(false);
      if (response.redirect_url) {
        window.location.href = response.redirect_url;
      } else {
        window.location.reload();
      }

    } catch (err) {
      console.error("Upgrade failed:", err);
      setError({
        message: 'Package upgrade failed',
      });
    }
  };

  return (
    <>
      <div className="company-details-container">
        <div className="company-details-inner">
          <h1>Company Details</h1>
        </div>

        {error && (
          <div className="error-message">
            {error.message}
            {error.errors && (
              <ul>
                {Object.entries(error.errors).map(([field, messages]) => (
                  <li key={field}>
                    {field}: {messages.join(', ')}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className='company-details-inner-wrapper'>
          <div className="company-details-card">
            <h2>General Info</h2>
            <div className="info-grid">
              <p><span>Name:</span> Company Name</p>
              <p><span>Company ID:</span> 12345</p>
              <p><span>Slug:</span> company-slug</p>
              <p><span>Business Category:</span> IT</p>
              <p><span>Subscription Status:</span> Active</p>
              <p><span>Payment Status:</span> Paid</p>
              <p><span>Verification Status:</span> Verified</p>
              <p><span>Created At:</span> 2023-01-01</p>
              <p><span>Updated At:</span> 2023-06-25</p>
            </div>
          </div>


          <div className="subscribed-package-card">
            <div className="ribbon">
              {company.subscription_type}
            </div>
            <h2>Subscribed Package</h2>
            <ul>
              <li><strong>Name:</strong> {subscribed_package.name}</li>
              <li><strong>Monthly Price:</strong> ₹{subscribed_package.monthly_price.toLocaleString()}</li>
              <li><strong>Annual Price:</strong> ₹{subscribed_package.annual_price.toLocaleString()}</li>
              <li><strong>Three Years Price:</strong> ₹{subscribed_package.three_years_price.toLocaleString()}</li>
              <li><strong>Employees Allowed:</strong> {subscribed_package.employee_numbers}</li>
              <li><strong>Items Allowed:</strong> {subscribed_package.items_number}</li>
              <li><strong>Daily Tasks:</strong> {subscribed_package.daily_tasks_number}</li>
              <li><strong>Invoices Allowed:</strong> {subscribed_package.invoices_number}</li>
            </ul>
            <div className='package-upgrade-btn-outer'>
              <button
                onClick={() => handleUpgradeClick(subscribed_package)}
                className="package-upgrade-btn"
              >
                Change Plan
              </button>
            </div>
          </div>

        </div>

        {/* Available Packages Section */}
        <div className="available-packages">
          <h2>Available Packages</h2>
          <div className="package-cards">
            {related_packages.filter(pkg => pkg.id !== subscribed_package.id).map((pkg: PackagePlan) => (
              <div key={pkg.id} className="available-packages-card">
                <div className='available-packages-ribbon'>{pkg.name}</div>
                <div className='available-packages-details'>
                  <p><strong>Monthly Price:</strong> ₹{pkg.monthly_price}</p>
                  <p><strong>Annual Price:</strong> ₹{pkg.annual_price}</p>
                  <p><strong>Three Years Price:</strong> ₹{pkg.three_years_price}</p>
                  <p><strong>Employees:</strong> {pkg.employee_numbers}</p>
                  <p><strong>Items:</strong> {pkg.items_number}</p>
                  <p><strong>Daily Tasks:</strong> {pkg.daily_tasks_number}</p>
                  <p><strong>Invoices:</strong> {pkg.invoices_number}</p>
                </div>
                <button
                  onClick={() => handleUpgradeClick(pkg)}
                  className='package-upgrade-btn'
                >
                  Upgrade to this Plan
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade Modal */}
        {showUpgradeModal && selectedPackage && (
          <Modal
            isOpen={showUpgradeModal}
            onClose={() => setShowUpgradeModal(false)}
            title={`${selectedPackage.id === subscribed_package.id ? 'Change' : 'Upgrade to'} ${selectedPackage.name}`}
            width="900px"
          >
            {(() => {
              const isSubscribedPackage = selectedPackage.id === subscribed_package.id;
              const currentType = company.subscription_type;

              return (
                <div className="subscription-options-outer" >
                  <div className="subscription-options">
                    {/* Monthly */}
                    <div className={`subscription-card ${isSubscribedPackage && currentType === 'monthly' ? 'current-plan' : ''}`}>
                      <h3>Monthly</h3>
                      <p className="price">₹{selectedPackage.monthly_price}</p>
                      <button
                        onClick={() => handlePackageUpgrade('monthly')}
                        disabled={
                          isSubscribedPackage &&
                          (currentType === 'monthly' || currentType === 'annual' || currentType === 'three_years')
                        }
                      >
                        {isSubscribedPackage && currentType === 'monthly'
                          ? 'Current Plan'
                          : isSubscribedPackage
                            ? 'Not Allowed'
                            : 'Select'}
                      </button>
                    </div>

                    {/* Annual */}
                    <div className={`subscription-card ${isSubscribedPackage && currentType === 'annual' ? 'current-plan' : ''}`}>
                      <h3>Annual</h3>
                      <p className="price">₹{selectedPackage.annual_price}</p>
                      <button
                        onClick={() => handlePackageUpgrade('annual')}
                        disabled={
                          isSubscribedPackage && currentType === 'three_years'
                        }
                      >
                        {isSubscribedPackage && currentType === 'annual'
                          ? 'Current Plan'
                          : isSubscribedPackage && currentType === 'three_years'
                            ? 'Not Allowed'
                            : 'Select'}
                      </button>
                    </div>

                    {/* Three Years */}
                    <div className={`subscription-card ${isSubscribedPackage && currentType === 'three_years' ? 'current-plan' : ''}`}>
                      <h3>Three Years</h3>
                      <p className="price">₹{selectedPackage.three_years_price}</p>
                      <button
                        onClick={() => handlePackageUpgrade('three_years')}
                        disabled={
                          isSubscribedPackage && currentType === 'three_years'
                        }
                      >
                        {isSubscribedPackage && currentType === 'three_years'
                          ? 'Current Plan'
                          : 'Select'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

          </Modal>
        )}

      </div>
    </>
  );
}

export default CompanyDetails;