'use client'
import React, { useState } from 'react';
import { useCreateVendorMutation } from '@/slices/vendor/vendorApi';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/utils/Company';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

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
      router.push(`/${companySlug}/employee/store/vendors`); // Adjust this route if needed
    } catch (err) {
      console.error('Error adding vendor:', err);
    }
  };

  return (
    <>
      <Link href={`/${companySlug}/employee/store`} className='back-button'><FaArrowLeft size={20} color='#fff' /></Link>
      <div className='stor-add-v-form-container'>
        <form className='stor-add-v-form-inner' onSubmit={handleSubmit}>
          <div>
            <label>Vendor Name:</label>
            <input
              type="text"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              required
            />
          </div>
          <button className='buttons' type="submit" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Vendor'}
          </button>
        </form>
      </div>
    </>
  );
};

export default Page;
