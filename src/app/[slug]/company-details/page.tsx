'use client';

import React, { useState } from 'react';
import { useFetchCompanyDetailsQuery } from '@/slices/company/companyApi';
import { useUpgradeCompanyPackageMutation } from '@/slices/superadminSlices/packages/packagesApi';
import Modal from '@/components/common/Modal';

function normalizePackageLimits(pkg: PackagePlan): PackagePlan {
  const limits = pkg.limits || [];

  const getLimitsByType = (type: 'monthly' | 'annual' | 'three_years'): PlanLimits => {
    const found = limits.find((l) => l.variant_type === type);
    return {
      employee_numbers: found?.employee_numbers || 0,
      items_number: found?.items_number || 0,
      daily_tasks_number: found?.daily_tasks_number || 0,
      invoices_number: found?.invoices_number || 0,
    };
  };

  return {
    ...pkg,
    monthly_limits: getLimitsByType('monthly'),
    annual_limits: getLimitsByType('annual'),
    three_years_limits: getLimitsByType('three_years'),
  };
}

// ==== Component ====

function CompanyDetails() {
  const { data, isLoading, isError, refetch } = useFetchCompanyDetailsQuery();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackagePlan | null>(null);
  const [upgradeCompanyPackage] = useUpgradeCompanyPackageMutation();
  const [error, setError] = useState<{ message: string; errors?: Record<string, string[]> } | null>(null);

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p>Something went wrong.</p>;

  const { company, subscribed_package, related_packages } = data as CompanyDetailsResponse;

  const normalizedSubscribed = normalizePackageLimits(subscribed_package);
  const normalizedPackages = related_packages.map(normalizePackageLimits);

  const handleUpgradeClick = (pkg: PackagePlan) => {
    setSelectedPackage(pkg);
    setShowUpgradeModal(true);
    setError(null);
  };

  const handlePackageUpgrade = async (subscriptionType: 'monthly' | 'annual' | 'three_years') => {
    try {
      if (!selectedPackage) throw new Error('No package selected');

      const formData = new FormData();
      formData.append("company_id", company.id.toString());
      if (selectedPackage.id === undefined || selectedPackage.id === null) {
        throw new Error('Selected package id is undefined');
      }
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
      setError({ message: 'Package upgrade failed' });
    }
  };

  return (
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

      <div className="company-details-inner-wrapper">
        <div className="company-details-card">
          <h2>General Info</h2>
          <div className="info-grid">
            <p><span>Name:</span> {company.company_name}</p>
            <p><span>Company ID:</span> {company.company_id}</p>
            <p><span>Slug:</span> {company.company_slug}</p>
            <p><span>Subscription Status:</span> {company.subscription_status}</p>
            <p><span>Payment Status:</span> {company.payment_status}</p>
            <p><span>Verification Status:</span> {company.verification_status}</p>
            <p><span>Created At:</span> {company.created_at}</p>
            <p><span>Updated At:</span> {company.updated_at}</p>
          </div>
        </div>

        <div className="subscribed-package-card">
          <div className="ribbon">{company.subscription_type}</div>
          <h2>Subscribed Package</h2>
          <ul>
            <li><strong>Name:</strong> {normalizedSubscribed.name}</li>
            <li><strong>Monthly Price:</strong> ₹{normalizedSubscribed.monthly_price.toLocaleString()}</li>
            <li><strong>Annual Price:</strong> ₹{normalizedSubscribed.annual_price.toLocaleString()}</li>
            <li><strong>Three Years Price:</strong> ₹{normalizedSubscribed.three_years_price.toLocaleString()}</li>
            <li><strong>Employees:</strong> {normalizedSubscribed.monthly_limits.employee_numbers}</li>
            <li><strong>Items:</strong> {normalizedSubscribed.monthly_limits.items_number}</li>
            <li><strong>Daily Tasks:</strong> {normalizedSubscribed.monthly_limits.daily_tasks_number}</li>
            <li><strong>Invoices:</strong> {normalizedSubscribed.monthly_limits.invoices_number}</li>
          </ul>
          <div className='package-upgrade-btn-outer'>
            <button
              onClick={() => handleUpgradeClick(normalizedSubscribed)}
              className="package-upgrade-btn"
            >
              Change Plan
            </button>
          </div>
        </div>
      </div>

      {/* Available Packages */}
      <div className="available-packages">
        <h2>Available Packages</h2>
        <div className="package-cards">
          {normalizedPackages
            .filter(pkg => pkg.id !== normalizedSubscribed.id)
            .map(pkg => (
              <div key={pkg.id} className="available-packages-card">
                <div className="available-packages-ribbon">{pkg.name}</div>
                <div className="available-packages-detail">
                  <p><strong>Monthly Price:</strong> ₹{pkg.monthly_price}</p>
                  <p><strong>Annual Price:</strong> ₹{pkg.annual_price}</p>
                  <p><strong>Three Years Price:</strong> ₹{pkg.three_years_price}</p>
                  <p><strong>Employees:</strong> {pkg.monthly_limits.employee_numbers}</p>
                  <p><strong>Items:</strong> {pkg.monthly_limits.items_number}</p>
                  <p><strong>Daily Tasks:</strong> {pkg.monthly_limits.daily_tasks_number}</p>
                  <p><strong>Invoices:</strong> {pkg.monthly_limits.invoices_number}</p>
                </div>
                <button
                  onClick={() => handleUpgradeClick(pkg)}
                  className="package-upgrade-btn"
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
          title={`${selectedPackage.id === normalizedSubscribed.id ? 'Change' : 'Upgrade to'} ${selectedPackage.name}`}
          width="900px"
        >
          <div className="package-details">
            {/* Categories Section (Optional — only if you want it here too)
  <div className="detail-section">
    <h3>Applicable Business Categories</h3>
    <div className="categories-grid">
      {selectedPackage.business_categories?.map((category) => (
        <div key={category.id} className="category-item">
          {category.name}
        </div>
      ))}
    </div>
  </div> */}

            {/* Price and Limits Cards */}
            <div className="detail-section">
              <h3>Pricing & Limits</h3>
              <div className="price-limits-grid">
                {selectedPackage.limits?.map((limit) => {
                  const isCurrent =
                    selectedPackage.id === normalizedSubscribed.id &&
                    company.subscription_type === limit.variant_type;

                  let priceLabel = '';
                  let priceValue = '';

                  switch (limit.variant_type) {
                    case 'monthly':
                      priceLabel = 'Monthly Price';
                      priceValue = `₹${Number(selectedPackage.monthly_price).toFixed(2)}`;
                      break;
                    case 'annual':
                      priceLabel = 'Annual Price';
                      priceValue = `₹${Number(selectedPackage.annual_price).toFixed(2)}`;
                      break;
                    case 'three_years':
                      priceLabel = 'Three Years Price';
                      priceValue = `₹${Number(selectedPackage.three_years_price).toFixed(2)}`;
                      break;
                    default:
                      priceLabel = 'Price';
                      priceValue = 'N/A';
                  }

                  return (
                    <div key={limit.id} className={`price-limit-card ${isCurrent ? 'current-plan' : ''}`}>
                      <div className="card-header">
                        <h4>{limit.variant_type.replace('_', ' ').toUpperCase()}</h4>
                      </div>
                      <div className="card-body">
                        <div className="price-section">
                          <div className="price-row">
                            <span className="price-label">{priceLabel}:</span>
                            <span className="price-value">{priceValue}</span>
                          </div>
                        </div>
                        <div className="limits-section">
                          <div className="limit-row">
                            <span className="limit-label">Employees:</span>
                            <span className="limit-value">{limit.employee_numbers}</span>
                          </div>
                          <div className="limit-row">
                            <span className="limit-label">Items:</span>
                            <span className="limit-value">{limit.items_number}</span>
                          </div>
                          <div className="limit-row">
                            <span className="limit-label">Daily Tasks:</span>
                            <span className="limit-value">{limit.daily_tasks_number}</span>
                          </div>
                          <div className="limit-row">
                            <span className="limit-label">Invoices:</span>
                            <span className="limit-value">{limit.invoices_number}</span>
                          </div>
                        </div>
                        <div className="select-button-container">
                          <button
                            className="buttons"
                            onClick={() => handlePackageUpgrade(limit.variant_type as 'monthly' | 'annual' | 'three_years')}
                            disabled={isCurrent}
                          >
                            {isCurrent ? 'Current Plan' : 'Select Plan'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </Modal>
      )}
    </div>
  );
}

export default CompanyDetails;
