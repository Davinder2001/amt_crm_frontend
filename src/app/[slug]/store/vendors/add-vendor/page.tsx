'use client'
import React, { useState } from 'react';
import { useCreateVendorMutation } from '@/slices/vendor/vendorApi';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/utils/Company';

const Page: React.FC = () => {
  const [vendorName, setVendorName] = useState('');
  const [createVendor, { isLoading }] = useCreateVendorMutation();
  const router = useRouter();
  const { companySlug } = useCompany();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createVendor({ vendor_name: vendorName }).unwrap();
      setVendorName('');
      router.push(`/${companySlug}/store/vendors`); // Adjust this route if needed
    } catch (err) {
      console.error('Error adding vendor:', err);
    }
  };

  return (
    <div>
      <h1>Add Vendors</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Vendor Name:</label>
          <input
            type="text"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Vendor'}
        </button>
      </form>
    </div>
  );
};

export default Page;
