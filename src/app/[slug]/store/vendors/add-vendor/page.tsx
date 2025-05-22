'use client'
import React, { useState } from 'react';
import { useCreateVendorMutation } from '@/slices/vendor/vendorApi';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/utils/Company';
import { FaArrowLeft, FaStore, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const VendorCreationPage: React.FC = () => {
  const [vendorName, setVendorName] = useState('');
  const [vendorNumber, setVendorNumber] = useState('');
  const [vendorEmail, setVendorEmail] = useState('');
  const [vendorAddress, setVendorAddress] = useState('');
  const [createVendor, { isLoading }] = useCreateVendorMutation();
  const router = useRouter();
  const { companySlug } = useCompany();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createVendor({
        vendor_name: vendorName,
        vendor_number: vendorNumber,
        vendor_email: vendorEmail || '',
        vendor_address: vendorAddress
      }).unwrap();

      toast.success('Vendor created successfully!');
      router.push(`/${companySlug}/store/vendors`);
    } catch (err) {
      console.error('Error adding vendor:', err);
      toast.error('Failed to create vendor');
    }
  };

  return (
    <div className="vendor-creation-page-outer">
      <button onClick={() => router.back()} className="back-button">
        <FaArrowLeft size={20} color="#fff" />
      </button>
      <div className='vendor-creation-page'>
        <div className="creation-header">
          <h1>Add New Vendor</h1>
          <p className="header-description">Fill in vendor details to add them to your system</p>
        </div>

        <form className="vendor-form" onSubmit={handleSubmit}>
          <div className="form-section">
            {/* Vendor Name */}
            <div className="input-group">
              <label>
                <FaStore className="input-icon" />
                Vendor Name <span className={`required-asterisk ${vendorName ? 'filled' : 'unfilled'}`}>*</span>
              </label>
              <input
                type="text"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                required
                placeholder="Enter vendor name"
                className="form-input"
              />
            </div>

            {/* Vendor Number */}
            <div className="input-group">
              <label>
                <FaPhone className="input-icon" />
                Vendor Number <span className={`required-asterisk ${vendorNumber ? 'filled' : 'unfilled'}`}>*</span>
              </label>
              <input
                type="text"
                value={vendorNumber}
                onChange={(e) => setVendorNumber(e.target.value)}
                required
                placeholder="Enter vendor phone number"
                className="form-input"
              />
            </div>

            {/* Vendor Email (optional) */}
            <div className="input-group">
              <label>
                <FaEnvelope className="input-icon" />
                Vendor Email <span className="optional-label">(optional)</span>
              </label>
              <input
                type="email"
                value={vendorEmail}
                onChange={(e) => setVendorEmail(e.target.value)}
                placeholder="Enter vendor email"
                className="form-input"
              />
            </div>

            {/* Vendor Address */}
            <div className="input-group">
              <label>
                <FaMapMarkerAlt className="input-icon" />
                Vendor Address <span className={`required-asterisk ${vendorAddress ? 'filled' : 'unfilled'}`}>*</span>
              </label>
              <textarea
                value={vendorAddress}
                onChange={(e) => setVendorAddress(e.target.value)}
                required
                placeholder="Enter vendor address"
                className="form-input"
              />
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button
                type="submit"
                className="primary-button"
                disabled={isLoading || !vendorName || !vendorNumber || !vendorAddress}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Creating Vendor...
                  </>
                ) : (
                  'Create Vendor'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorCreationPage;
