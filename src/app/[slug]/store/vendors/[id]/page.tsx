'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { useFetchVendorByIdQuery } from '@/slices/vendor/vendorApi';

const Page = () => {
  const params = useParams();
  const vendorId = Number(params?.id);

  const { data: vendor, error, isLoading } = useFetchVendorByIdQuery(vendorId);

  if (isLoading) return <p>Loading vendor...</p>;
  if (error) return <p>Failed to fetch vendor details.</p>;
  if (!vendor) return <p>Vendor not found.</p>;

  return (
    <div className="vendor-details-page">
      <h1>Vendor Details</h1>
      <p><strong>Name:</strong> {vendor.vendor_name}</p>
      <p><strong>Number:</strong> {vendor.vendor_number}</p>
      <p><strong>Email:</strong> {vendor.vendor_email || 'N/A'}</p>
      <p><strong>Address:</strong> {vendor.vendor_address}</p>
    </div>
  );
};

export default Page;
