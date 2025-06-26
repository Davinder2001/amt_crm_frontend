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
        <h1>Company Details</h1>

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
          <div className="card">
            <h2>General Info</h2>
            <p><strong>Name:</strong> {company.company_name}</p>
            <p><strong>Company ID:</strong> {company.company_id}</p>
            <p><strong>Slug:</strong> {company.company_slug}</p>
            <p><strong>Business Category:</strong> {company.business_category}</p>
            <p><strong>Subscription Status:</strong> {company.subscription_status}</p>
            <p><strong>Payment Status:</strong> {company.payment_status}</p>
            <p><strong>Verification Status:</strong> {company.verification_status}</p>
            <p><strong>Created At:</strong> {new Date(company.created_at).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(company.updated_at).toLocaleString()}</p>
          </div>

          <div className="card green">
            <h2>Subscribed Package</h2>
            <p><strong>Name:</strong> {subscribed_package.name}</p>
            <p><strong>Type:</strong> {company.subscription_type}</p>
            <p><strong>Monthly Price:</strong> ₹{subscribed_package.monthly_price}</p>
            <p><strong>Annual Price:</strong> ₹{subscribed_package.annual_price}</p>
            <p><strong>Three Years Price:</strong> ₹{subscribed_package.three_years_price}</p>
            <p><strong>Employees Allowed:</strong> {subscribed_package.employee_numbers}</p>
            <p><strong>Items Allowed:</strong> {subscribed_package.items_number}</p>
            <p><strong>Daily Tasks:</strong> {subscribed_package.daily_tasks_number}</p>
            <p><strong>Invoices Allowed:</strong> {subscribed_package.invoices_number}</p>

            <button
              onClick={() => handleUpgradeClick(subscribed_package)}
              className='package-upgrade-btn'
            >
              Change Plan
            </button>
          </div>
        </div>

        {/* Available Packages Section */}
        <div className="available-packages">
          <h2>Available Packages</h2>
          <div className="package-cards">
            {related_packages.filter(pkg => pkg.id !== subscribed_package.id).map((pkg: PackagePlan) => (
              <div key={pkg.id} className="card">
                <h3>{pkg.name}</h3>
                <p><strong>Monthly Price:</strong> ₹{pkg.monthly_price}</p>
                <p><strong>Annual Price:</strong> ₹{pkg.annual_price}</p>
                <p><strong>Three Years Price:</strong> ₹{pkg.three_years_price}</p>
                <p><strong>Employees:</strong> {pkg.employee_numbers}</p>
                <p><strong>Items:</strong> {pkg.items_number}</p>
                <p><strong>Daily Tasks:</strong> {pkg.daily_tasks_number}</p>
                <p><strong>Invoices:</strong> {pkg.invoices_number}</p>
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
            {/** 👇 Insert the constants here */}
            {/* {(() => {
              const isSubscribedPackage = selectedPackage.id === subscribed_package.id;
              const currentType = company.subscription_type;

              return (
                <div className="subscription-options">
                  <div className={`subscription-card ${isSubscribedPackage && currentType === 'monthly' ? 'current-plan' : ''}`}>
                    <h3>Monthly</h3>
                    <p className="price">₹{selectedPackage.monthly_price}</p>
                    <button
                      onClick={() => handlePackageUpgrade('monthly')}
                      disabled={isSubscribedPackage && (currentType === 'monthly' || currentType === 'annual' || currentType === 'three_years')}
                    >
                      {isSubscribedPackage && (currentType === 'monthly' || currentType === 'annual' || currentType === 'three_years')
                        ? 'Not Allowed'
                        : 'Select'}
                    </button>
                  </div>

                  <div className={`subscription-card ${isSubscribedPackage && currentType === 'annual' ? 'current-plan' : ''}`}>
                    <h3>Annual</h3>
                    <p className="price">₹{selectedPackage.annual_price}</p>
                    <button
                      onClick={() => handlePackageUpgrade('annual')}
                      disabled={isSubscribedPackage && currentType === 'three_years'}
                    >
                      {isSubscribedPackage && currentType === 'three_years'
                        ? 'Not Allowed'
                        : isSubscribedPackage && currentType === 'annual'
                          ? 'Current Plan'
                          : 'Select'}
                    </button>
                  </div>

                  <div className={`subscription-card ${isSubscribedPackage && currentType === 'three_years' ? 'current-plan' : ''}`}>
                    <h3>Three Years</h3>
                    <p className="price">₹{selectedPackage.three_years_price}</p>
                    <button
                      onClick={() => handlePackageUpgrade('three_years')}
                      disabled={isSubscribedPackage && currentType === 'three_years'}
                    >
                      {isSubscribedPackage && currentType === 'three_years'
                        ? 'Current Plan'
                        : 'Select'}
                    </button>
                  </div>
                </div>
              );
            })()} */}
            {(() => {
              const isSubscribedPackage = selectedPackage.id === subscribed_package.id;
              const currentType = company.subscription_type;

              return (
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
              );
            })()}

          </Modal>
        )}

      </div>

      <style jsx>{`
      
        .company-details-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .company-details-inner-wrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .card.green {
          border-top: 4px solid #4CAF50;
        }
        
        .package-upgrade-btn {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 15px;
        }
        
        .package-upgrade-btn:hover {
          background-color: #45a049;
        }
        
        .available-packages {
          margin-top: 30px;
        }
        
        .package-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 15px;
        }
        
        .subscription-options {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          padding: 20px;
        }
        
        .subscription-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
        }
        
        .subscription-card.current-plan {
          border: 2px solid #4CAF50;
          background-color: #f8fff8;
        }
        
        .subscription-card h3 {
          margin-top: 0;
        }
        
        .price {
          font-size: 24px;
          font-weight: bold;
          margin: 15px 0;
        }
        
        .subscription-card button {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 4px;
          cursor: pointer;
          width: 100%;
        }
        
        .subscription-card button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }        
        .error-message {
          color: #d32f2f;
          background-color: #fde8e8;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
          border: 1px solid #f5c6cb;
        }
        
        .error-message ul {
          margin: 10px 0 0 0;
          padding-left: 20px;
        }
      `}</style>
    </>
  );
}

export default CompanyDetails;