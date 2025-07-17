'use client';

import React, { useState } from 'react';
import { useFetchCompanyDetailsQuery } from '@/slices/company/companyApi';
import { useUpgradeCompanyPackageMutation } from '@/slices/superadminSlices/packages/packagesApi';
import Modal from '@/components/common/Modal';
import LoadingState from '@/components/common/LoadingState';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes } from 'react-icons/fa';

function CompanyDetails() {
  const { data, isLoading, isError, refetch } = useFetchCompanyDetailsQuery();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackagePlan | null>(null);
  const [upgradeCompanyPackage] = useUpgradeCompanyPackageMutation();
  const [processingVariant, setProcessingVariant] = useState<'annual' | 'three_years' | null>(null);

  if (isLoading) return <LoadingState />;
  if (isError || !data) return <p>Something went wrong.</p>;

  const { company, subscribed_package, related_packages } = data as CompanyDetailsResponse;

  const handleUpgradeClick = (pkg: PackagePlan) => {
    setSelectedPackage(pkg);
    setShowUpgradeModal(true);
  };

  const handlePackageUpgrade = async (subscriptionType: 'annual' | 'three_years') => {
    if (!selectedPackage) {
      toast.error('No package selected');
      return;
    }

    setProcessingVariant(subscriptionType);

    try {
      const formData = new FormData();
      formData.append("company_id", company.id.toString());
      formData.append("package_id", selectedPackage.id!.toString());
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
    } catch {
      toast.error('Package upgrade failed. Please try again.');
    } finally {
      setProcessingVariant(null);
    }
  };

  return (
    <div className="company-details-container">

      <div className="panel">
        <div className="panel-header">
          <h2>General Info</h2>
        </div>
        <div className="c-details-current-package">
          <div className="c-details-grid">
            <div className="info-line">
              <strong>Name:</strong> <p>{company.company_name}</p>
            </div>
            <div className="info-line">
              <strong>Company ID:</strong> <p>{company.company_id}</p>
            </div>
            <div className="info-line">
              <strong>Slug:</strong> <p>{company.company_slug}</p>
            </div>
            <div className="info-line">
              <strong>Subscription Status:</strong> <p>{company.subscription_status}</p>
            </div>
            <div className="info-line">
              <strong>Payment Status:</strong> <p>{company.payment_status}</p>
            </div>
            <div className="info-line">
              <strong>Verification Status:</strong> <p>{company.verification_status}</p>
            </div>
            <div className="info-line">
              <strong>Created At:</strong> <p>{new Date(company.created_at).toLocaleDateString()}</p>
            </div>
            <div className="info-line">
              <strong>Updated At:</strong> <p>{new Date(company.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="subscribed-package-card">
            <div className="ribbon">{company.subscription_type}</div>
            <h2>Subscribed Package</h2>
            <ul>
              <li><strong>Name:</strong> {subscribed_package.name}</li>
              <li><strong>Annual Price:</strong> ₹{subscribed_package.annual_price.toLocaleString()}</li>
              <li><strong>Three Years Price:</strong> ₹{subscribed_package.three_years_price.toLocaleString()}</li>
              <li><strong>Employee Limit:</strong> {subscribed_package.employee_limit}</li>
              <li><strong>Task Module:</strong> {subscribed_package.task ? <FaCheck color='#008001' /> : <FaTimes color='#ff0000' />}</li>
              <li><strong>Chat Module:</strong> {subscribed_package.chat ? <FaCheck color='#008001' /> : <FaTimes color='#ff0000' />}</li>
              <li><strong>HR Module:</strong> {subscribed_package.hr ? <FaCheck color='#008001' /> : <FaTimes color='#ff0000' />}</li>
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
      </div>

      {related_packages && related_packages.filter(pkg => pkg.id !== subscribed_package.id).length > 0 &&
        <div className="panel">
          <div className="panel-header">
            <h2>Available Packages</h2>
          </div>
          <div className="available-packages">
            {related_packages
              .filter(pkg => pkg.id !== subscribed_package.id)
              .map(pkg => (
                <div key={pkg.id} className="available-packages-card">
                  <div className="available-packages-detail">
                    <h2>{pkg.name}</h2>
                    <div className='available-package-details-wrapper'>
                      <p><strong>Annual Price:</strong> ₹{pkg.annual_price.toLocaleString()}</p>
                      <p><strong>Three Years Price:</strong> ₹{pkg.three_years_price.toLocaleString()}</p>
                      <p><strong>Employee Limit:</strong> {pkg.employee_limit}</p>
                      <p><strong>Task Module:</strong> {pkg.task ? <FaCheck color='#008001' /> : <FaTimes color='#ff0000' />}</p>
                      <p><strong>Chat Module:</strong> {pkg.chat ? <FaCheck color='#008001' /> : <FaTimes color='#ff0000' />}</p>
                      <p><strong>HR Module:</strong> {pkg.hr ? <FaCheck color='#008001' /> : <FaTimes color='#ff0000' />}</p>
                    </div>
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
      }


      {showUpgradeModal && selectedPackage && (
        <Modal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          title={`${selectedPackage.id === subscribed_package.id ? 'Change' : 'Upgrade to'} ${selectedPackage.name}`}
          width="900px"
        >
          <div className="package-details">
            <div className="detail-section">
              <h3>Pricing & Features</h3>
              <div className="price-limits-grid">
                {[
                  { type: 'annual', price: selectedPackage.annual_price },
                  { type: 'three_years', price: selectedPackage.three_years_price }
                ].map(({ type, price }) => {
                  const isCurrent =
                    selectedPackage.id === subscribed_package.id &&
                    company.subscription_type === type;

                  return (
                    <div key={type} className={`price-limit-card ${isCurrent ? 'current-plan' : ''}`}>
                      <div className="card-header">
                        <h4>{type.replace('_', ' ').toUpperCase()}</h4>
                      </div>
                      <div className="card-body">
                        <div className="price-section">
                          <div className="price-row">
                            <span className="price-label">{type === 'annual' ? 'Annual' : 'Three Years'} Price:</span>
                            <span className="price-value">₹{price.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="features-section">
                          <div className="feature-row">
                            <span className="feature-label">Employee Limit:</span>
                            <span className="feature-value">{selectedPackage.employee_limit}</span>
                          </div>
                          <div className="feature-row">
                            <span className="feature-label">Task Module:</span>
                            <span className="feature-value">{selectedPackage.task ? 'Enabled' : 'Disabled'}</span>
                          </div>
                          <div className="feature-row">
                            <span className="feature-label">Chat Module:</span>
                            <span className="feature-value">{selectedPackage.chat ? 'Enabled' : 'Disabled'}</span>
                          </div>
                          <div className="feature-row">
                            <span className="feature-label">HR Module:</span>
                            <span className="feature-value">{selectedPackage.hr ? 'Enabled' : 'Disabled'}</span>
                          </div>
                        </div>
                        <div className="select-button-container">
                          <button
                            className="buttons"
                            onClick={() => handlePackageUpgrade(type as 'annual' | 'three_years')}
                            disabled={isCurrent || processingVariant === type}
                            style={isCurrent ? {
                              backgroundColor: '#eee',
                              cursor: 'not-allowed',
                              color: 'black',
                            } : {}}
                          >
                            {isCurrent
                              ? 'Current Plan'
                              : processingVariant === type
                                ? 'Processing...'
                                : 'Select Plan'}
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