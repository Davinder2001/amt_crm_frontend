'use client';

import React, { useState } from 'react';
import { useFetchCompanyDetailsQuery } from '@/slices/company/companyApi';
import { useUpgradeCompanyPackageMutation } from '@/slices/superadminSlices/packages/packagesApi';
import Modal from '@/components/common/Modal';

function CompanyDetails() {
  const { data, isLoading, isError } = useFetchCompanyDetailsQuery();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [upgradeCompanyPackage] = useUpgradeCompanyPackageMutation();
  const [error, setError] = useState(null);

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p>Something went wrong.</p>;

  const { company, subscribed_package, related_packages } = data;

  const handleUpgradeClick = (pkg) => {
    setSelectedPackage(pkg);
    setShowUpgradeModal(true);
    setError(null);
  };

  const handlePackageUpgrade = async (subscriptionType) => {
    try {
      const formData = new FormData();
      formData.append("package_id", selectedPackage.id.toString());
      formData.append("package_type", subscriptionType);

      const response = await upgradeCompanyPackage(formData).unwrap();

      // ✅ Save only what you need with specific keys
      localStorage.setItem("upgradepackage", JSON.stringify({
        packageId: selectedPackage.id,
        packageType: subscriptionType,
      }));

      if (response.redirect_url) {
        window.location.href = response.redirect_url;
      }

    } catch (err) {
      console.error("Upgrade failed:", err);
    }
  };




  return (
    <>
      <div className="company-details-container">
        <h1>Company Details</h1>

        {error && (
          <div className="error-message">
            {error}
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
            {related_packages.filter(pkg => pkg.id !== subscribed_package.id).map((pkg) => (
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
        {showUpgradeModal && (
          <Modal
            isOpen={showUpgradeModal}
            onClose={() => setShowUpgradeModal(false)}
            title={`${selectedPackage?.id === subscribed_package.id ? 'Change' : 'Upgrade to'} ${selectedPackage?.name || ''}`}
            width="900px"
          >
            {selectedPackage && (
              <div className="subscription-options">
                <div className={`subscription-card ${selectedPackage.id === subscribed_package.id && company.subscription_type === 'monthly' ? 'current-plan' : ''}`}>
                  <h3>Monthly</h3>
                  <p className="price">₹{selectedPackage.monthly_price}</p>
                  <button
                    onClick={() => handlePackageUpgrade('monthly')}
                    disabled={selectedPackage.id === subscribed_package.id && company.subscription_type === 'monthly'}
                  >
                    {selectedPackage.id === subscribed_package.id && company.subscription_type === 'monthly' ? 'Current Plan' : 'Select'}
                  </button>
                </div>

                <div className={`subscription-card ${selectedPackage.id === subscribed_package.id && company.subscription_type === 'annual' ? 'current-plan' : ''}`}>
                  <h3>Annual</h3>
                  <p className="price">₹{selectedPackage.annual_price}</p>
                  <button
                    onClick={() => handlePackageUpgrade('annual')}
                    disabled={selectedPackage.id === subscribed_package.id && company.subscription_type === 'annual'}
                  >
                    {selectedPackage.id === subscribed_package.id && company.subscription_type === 'annual' ? 'Current Plan' : 'Select'}
                  </button>
                </div>

                <div className={`subscription-card ${selectedPackage.id === subscribed_package.id && company.subscription_type === 'three_years' ? 'current-plan' : ''}`}>
                  <h3>Three Years</h3>
                  <p className="price">₹{selectedPackage.three_years_price}</p>
                  <button
                    onClick={() => handlePackageUpgrade('three_years')}
                    disabled={selectedPackage.id === subscribed_package.id && company.subscription_type === 'three_years'}
                  >
                    {selectedPackage.id === subscribed_package.id && company.subscription_type === 'three_years' ? 'Current Plan' : 'Select'}
                  </button>
                </div>
              </div>
            )}
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