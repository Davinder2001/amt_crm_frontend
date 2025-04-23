'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useFetchSingleCompanyQuery } from '@/slices/superadminSlices/company/companyApi';

const ViewCompanyPage = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useFetchSingleCompanyQuery(id as string);

  if (isLoading) return <div>Loading company details...</div>;
  if (error) return <div>Error loading company details.</div>;

  const company = data?.data;

  if (!company) return <div>Company not found.</div>;

  return (
    <div className="p-6 max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold">{company.company_name}</h1>

      <div><strong>Company ID:</strong> {company.company_id}</div>
      <div><strong>Slug:</strong> {company.company_slug}</div>
      <div><strong>Verification Status:</strong> {company.verification_status}</div>
      <div><strong>Payment Status:</strong> {company.payment_status}</div>
      <div><strong>Business Address:</strong> {company.business_address}</div>
      <div><strong>Business ID:</strong> {company.business_id}</div>
      <div><strong>Business Proof Type:</strong> {company.business_proof_type}</div>
      <div><strong>PIN Code:</strong> {company.pin_code}</div>

      {company.business_proof_front && (
        <div>
          <h2 className="font-semibold mt-4">Business Proof Front:</h2>
          <img
            src={`/${company.business_proof_front}`}
            alt="Business Proof Front"
            className="border rounded shadow max-w-full max-h-80 object-contain"
          />
        </div>
      )}

      {company.business_proof_back && (
        <div>
          <h2 className="font-semibold mt-4">Business Proof Back:</h2>
          <img
            src={`/${company.business_proof_back}`}
            alt="Business Proof Back"
            className="border rounded shadow max-w-full max-h-80 object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default ViewCompanyPage;
