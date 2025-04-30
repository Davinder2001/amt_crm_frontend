// 'use client';

// import React from 'react';
// import { useParams } from 'next/navigation';
// import { useFetchSingleCompanyQuery } from '@/slices/superadminSlices/company/companyApi';

// const ViewCompanyPage = () => {
//   const { id } = useParams();
//   const { data, isLoading, error } = useFetchSingleCompanyQuery(id as string);

//   if (isLoading) return <div>Loading company details...</div>;
//   if (error) return <div>Error loading company details.</div>;

//   const company = data?.data;

//   if (!company) return <div>Company not found.</div>;

//   return (
//     <div className="p-6 max-w-3xl space-y-4">
//       <h1 className="text-2xl font-bold">{company.company_name}</h1>

//       <div><strong>Company ID:</strong> {company.company_id}</div>
//       <div><strong>Slug:</strong> {company.company_slug}</div>
//       <div><strong>Verification Status:</strong> {company.verification_status}</div>
//       <div><strong>Payment Status:</strong> {company.payment_status}</div>
//       <div><strong>Business Address:</strong> {company.business_address}</div>
//       <div><strong>Business ID:</strong> {company.business_id}</div>
//       <div><strong>Business Proof Type:</strong> {company.business_proof_type}</div>
//       <div><strong>PIN Code:</strong> {company.pin_code}</div>

//       {company.business_proof_front && (
//         <div>
//           <h2 className="font-semibold mt-4">Business Proof Front:</h2>
//           <img
//             src={`/${company.business_proof_front}`}
//             alt="Business Proof Front"
//             className="border rounded shadow max-w-full max-h-80 object-contain"
//           />
//         </div>
//       )}

//       {company.business_proof_back && (
//         <div>
//           <h2 className="font-semibold mt-4">Business Proof Back:</h2>
//           <img
//             src={`/${company.business_proof_back}`}
//             alt="Business Proof Back"
//             className="border rounded shadow max-w-full max-h-80 object-contain"
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ViewCompanyPage;










'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useFetchSingleCompanyQuery } from '@/slices/superadminSlices/company/companyApi';

const ViewCompanyPage = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useFetchSingleCompanyQuery(id as string);

  if (isLoading) return <div>Loading company details...</div>;
  if (error) return <div>Error loading company details.</div>;

  const company = data?.data as unknown as {
    company_name: string;
    company_id: string;
    company_slug: string;
    verification_status: string;
    payment_status: string;
    business_address: string;
    business_id: string;
    business_proof_type: string;
    pin_code: string;
    business_proof_front?: string;
    business_proof_back?: string;
  };

  if (!company) return <div>Company not found.</div>;

  return (
    <div className="vc-container">
      <header className="vc-header">
        <h1 className="vc-title">{company.company_name}</h1>
        <p className="vc-subtitle">
          ID: {company.company_id} &nbsp;|&nbsp; Slug: {company.company_slug}
        </p>
      </header>

      <dl className="vc-grid">
        <div className="vc-item">
          <dt>Verification Status</dt>
          <dd>{company.verification_status.replace('_', ' ')}</dd>
        </div>
        <div className="vc-item">
          <dt>Payment Status</dt>
          <dd>{company.payment_status.replace('_', ' ')}</dd>
        </div>
        <div className="vc-item">
          <dt>Business Address</dt>
          <dd>{company.business_address}</dd>
        </div>
        <div className="vc-item">
          <dt>Business ID</dt>
          <dd>{company.business_id}</dd>
        </div>
        <div className="vc-item">
          <dt>Proof Type</dt>
          <dd>{company.business_proof_type}</dd>
        </div>
        <div className="vc-item">
          <dt>PIN Code</dt>
          <dd>{company.pin_code}</dd>
        </div>
      </dl>

      {(company.business_proof_front || company.business_proof_back) && (
        <div className="vc-proofs">
          {company.business_proof_front && (
            <figure className="vc-proof">
              <figcaption>Proof Front</figcaption>
              <img src={`/${company.business_proof_front}`} alt="Front Proof" />
            </figure>
          )}
          {company.business_proof_back && (
            <figure className="vc-proof">
              <figcaption>Proof Back</figcaption>
              <img src={`/${company.business_proof_back}`} alt="Back Proof" />
            </figure>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewCompanyPage;
