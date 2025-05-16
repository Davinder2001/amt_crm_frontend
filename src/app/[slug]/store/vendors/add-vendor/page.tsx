'use client'
import React, { useState } from 'react';
import { useCreateVendorMutation } from '@/slices/vendor/vendorApi';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/utils/Company';
import { FaArrowLeft, FaStore } from 'react-icons/fa';
import { toast } from 'react-toastify';

const VendorCreationPage: React.FC = () => {
  const [vendorName, setVendorName] = useState('');
  const [createVendor, { isLoading }] = useCreateVendorMutation();
  const router = useRouter();
  const { companySlug } = useCompany();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createVendor({ vendor_name: vendorName }).unwrap();
      toast.success('Vendor created successfully!');
      router.push(`/${companySlug}/store/vendors`);
    } catch (err) {
      console.error('Error adding vendor:', err);
      toast.error('Failed to create vendor');
    }
  };

  return (
    <div className="vendor-creation-page-outer">
      <button
          onClick={() => router.back()}
          className="back-button"
        >
          <FaArrowLeft size={20} color="#fff" />
        </button>
      <div className='vendor-creation-page'>
      
      <div className="creation-header">
        
        <h1>Add New Vendor</h1>
        <p className="header-description">Fill in vendor details to add them to your system</p>
      </div>

      <form className="vendor-form" onSubmit={handleSubmit}>
        <div>
          
            <div className="form-section">
              <div className="input-group">
                <label>
                  <FaStore className="input-icon" />
                  Vendor Name{' '}
                  <span className={`required-asterisk ${vendorName ? 'filled' : 'unfilled'}`}>*</span>
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
            </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="primary-button"
              disabled={isLoading || !vendorName}
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
    </div >
  );
};

export default VendorCreationPage;