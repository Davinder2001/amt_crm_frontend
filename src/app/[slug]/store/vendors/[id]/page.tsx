// 'use client';
// import React from 'react';
// import { useParams } from 'next/navigation';
// import { useFetchVendorByIdQuery } from '@/slices/vendor/vendorApi';

// const Page = () => {
//   const params = useParams();
//   const vendorId = Number(params?.id);

//   const { data: vendor, error, isLoading } = useFetchVendorByIdQuery(vendorId);

//   if (isLoading) return <p>Loading vendor...</p>;
//   if (error) return <p>Failed to fetch vendor details.</p>;
//   if (!vendor) return <p>Vendor not found.</p>;

//   return (
//     <div className="vendor-details-page">
//       <h1>Vendor Details</h1>
//       <p><strong>Name:</strong> {vendor.vendor_name}</p>
//       <p><strong>Number:</strong> {vendor.vendor_number}</p>
//       <p><strong>Email:</strong> {vendor.vendor_email || 'N/A'}</p>
//       <p><strong>Address:</strong> {vendor.vendor_address}</p>
//     </div>
//   );
// };

// export default Page;

'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFetchVendorByIdQuery } from '@/slices/vendor/vendorApi';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import { useCompany } from '@/utils/Company';

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const vendorId = Number(params?.id);
  const { companySlug } = useCompany();

  const { data: vendor, error, isLoading } = useFetchVendorByIdQuery(vendorId);

  if (isLoading) return <p className="loading-text">Loading vendor...</p>;
  if (error) return <p className="error-text">Failed to fetch vendor details.</p>;
  if (!vendor) return <p className="empty-text">Vendor not found.</p>;

  return (
    <div className="vendor-details-outer">
    <Link href={`/${companySlug}/store/vendors`} className='back-button'><FaArrowLeft size={20} color='#fff' /></Link>
    <div className="vendor-details-page">


      <div className="vendor-card">
        <h2 className="vendor-title">Vendor Details</h2>
        <div className="vendor-info">
          <p><strong>ID:</strong> {vendor.id}</p>
          <p><strong>Name:</strong> {vendor.vendor_name}</p>
          <p><strong>Number:</strong> {vendor.vendor_number}</p>
          <p><strong>Email:</strong> {vendor.vendor_email || 'N/A'}</p>
          <p><strong>Address:</strong> {vendor.vendor_address}</p>
          <p><strong>Created At:</strong> {new Date(vendor.created_at).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(vendor.updated_at).toLocaleString()}</p>
        </div>

      </div>
      </div>
    </div>
  );
};

export default Page;
