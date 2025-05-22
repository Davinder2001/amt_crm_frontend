// "use client";
// import React, { useEffect } from 'react'
// import { useBreadcrumb } from '@/provider/BreadcrumbContext';
// import { useParams } from 'next/navigation';
// import { useFetchSingleCompanyQuery } from '@/slices/superadminSlices/company/companyApi';
// import { useRouter } from 'next/navigation';
// import { FaArrowLeft } from 'react-icons/fa';
// import Image from 'next/image';
// import Link from 'next/link';

// const ViewCompanyPage = () => {
//   const { setTitle } = useBreadcrumb();

//   useEffect(() => {
//     setTitle('Company View'); // Update breadcrumb title
//   }, [setTitle]);

//   const { id } = useParams();
//   const { data, isLoading, error } = useFetchSingleCompanyQuery(id as string);
//   const router = useRouter();

//   const company = data?.data as unknown as {
//     company_name: string;
//     company_id: string;
//     company_slug: string;
//     verification_status: string;
//     payment_status: string;
//     business_address: string;
//     business_id: string;
//     business_proof_type: string;
//     pin_code: string;
//     business_proof_front?: string;
//     business_proof_back?: string;
//   };

//   if (!company) return <div>Company not found.</div>;
//   if (isLoading) return <div>Loading company details...</div>;
//   if (error) return <div>Error loading company details.</div>;
//   return (
//     <div className="vc-container">
//       <div className='vC-back-btn'>
//         <Link href="/superadmin/companies" className='back-button'>
//           <FaArrowLeft size={16} color='#fff' />
//         </Link>
//       </div>
//       <div className="vc-inner-container">

//         <header className="vc-header">
//           <h1 className="vc-title">{company.company_name}</h1>
//           <p className="vc-subtitle">
//             ID: {company.company_id} &nbsp;|&nbsp; Slug: {company.company_slug}
//           </p>
//         </header>

//         <dl className="vc-grid">
//           <div className="vc-item">
//             <dt>Verification Status:</dt>
//             <dd>{company.verification_status.replace('_', ' ')}</dd>
//           </div>
//           <div className="vc-item">
//             <dt>Payment Status:</dt>
//             <dd>{company.payment_status.replace('_', ' ')}</dd>
//           </div>
//           <div className="vc-item">
//             <dt>Business Address:</dt>
//             <dd>{company.business_address}</dd>
//           </div>
//           <div className="vc-item">
//             <dt>Business ID:</dt>
//             <dd>{company.business_id}</dd>
//           </div>
//           <div className="vc-item">
//             <dt>Proof Type:</dt>
//             <dd>{company.business_proof_type}</dd>
//           </div>
//           <div className="vc-item">
//             <dt>PIN Code:</dt>
//             <dd>{company.pin_code}</dd>
//           </div>
//         </dl>
//         <div className="Vcompany-edit-delete-btn-outer">
//           <div className="Vcompany-edit-delete-btn-inner">
//             <span onClick={() => router.push(`/superadmin/companies/edit/${company.company_id}`)}
//               className="buttons"
//               title="Edit">
//              Edit Company
//             </span>
//             <span onClick={() => router.push(`/superadmin/companies/delete/${company.company_id}`)}
//               className="buttons"
//               title="Delete">
//               Delete Company
//             </span>
//           </div>
//         </div>

//         {(company.business_proof_front || company.business_proof_back) && (
//           <div className="vc-proofs">
//             {company.business_proof_front && (
//               <figure className="vc-proof">
//                 <figcaption>Proof Front</figcaption>
//                 <Image src={`/${company.business_proof_front}`} alt="Front Proof" width={200} height={200} />
//               </figure>
//             )}
//             {company.business_proof_back && (
//               <figure className="vc-proof">
//                 <figcaption>Proof Back</figcaption>
//                 <Image src={`/${company.business_proof_back}`} alt="Back Proof" width={200} height={200} />
//               </figure>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ViewCompanyPage;












// "use client";
// import React, { useEffect } from 'react'
// import { useBreadcrumb } from '@/provider/BreadcrumbContext';
// import { useParams } from 'next/navigation';
// import { useFetchSingleCompanyQuery } from '@/slices/superadminSlices/company/companyApi';
// import { useRouter } from 'next/navigation';
// import { FaArrowLeft } from 'react-icons/fa';
// import Image from 'next/image';
// import Link from 'next/link';

// const ViewCompanyPage = () => {
//   const { setTitle } = useBreadcrumb();

//   useEffect(() => {
//     setTitle('Company View');
//   }, [setTitle]);

//   const { id } = useParams();
//   const { data, isLoading, error } = useFetchSingleCompanyQuery(id as string);
//   const router = useRouter();

//   const company = data?.data as unknown as {
//     id: number;
//     admin_id: number | null;
//     company_name: string;
//     company_id: string;
//     company_slug: string;
//     business_address: string;
//     pin_code: string;
//     business_proof_type: string;
//     business_id: string;
//     business_proof_front?: string;
//     business_proof_back?: string;
//     payment_status: string;
//     verification_status: string;
//   };

//   if (!company) return <div>Company not found.</div>;
//   if (isLoading) return <div>Loading company details...</div>;
//   if (error) return <div>Error loading company details.</div>;

//   return (
//     <div className="vc-container">
// <div className='vC-back-btn'>
//   <Link href="/superadmin/companies" className='back-button'>
//     <FaArrowLeft size={16} color='#fff' />
//   </Link>
// </div>
//       <div className="vc-inner-container">

//         <header className="vc-header">
//           <h1 className="vc-title">{company.company_name}</h1>
//           <p className="vc-subtitle">
//             ID: {company.company_id} &nbsp;|&nbsp; Slug: {company.company_slug}
//           </p>
//         </header>

//         <dl className="vc-grid">
//           <div className="vc-item">
//             <dt>System ID:</dt>
//             <dd>{company.id}</dd>
//           </div>
//           <div className="vc-item">
//             <dt>Admin ID:</dt>
//             <dd>{company.admin_id || 'N/A'}</dd>
//           </div>
//           <div className="vc-item">
//             <dt>Verification Status:</dt>
//             <dd>{company.verification_status.replace('_', ' ')}</dd>
//           </div>
//           <div className="vc-item">
//             <dt>Payment Status:</dt>
//             <dd>{company.payment_status.replace('_', ' ')}</dd>
//           </div>
//           <div className="vc-item">
//             <dt>Business Address:</dt>
//             <dd>{company.business_address}</dd>
//           </div>
//           <div className="vc-item">
//             <dt>PIN Code:</dt>
//             <dd>{company.pin_code}</dd>
//           </div>
//           <div className="vc-item">
//             <dt>Business ID:</dt>
//             <dd>{company.business_id}</dd>
//           </div>
//           <div className="vc-item">
//             <dt>Proof Type:</dt>
//             <dd>{company.business_proof_type}</dd>
//           </div>
//           <div className="vc-item">
//             <dt>Proof Front:</dt>
//             <dd>{company.business_proof_front ? 'Uploaded' : 'Not Available'}</dd>
//           </div>
//           <div className="vc-item">
//             <dt>Proof Back:</dt>
//             <dd>{company.business_proof_back ? 'Uploaded' : 'Not Available'}</dd>
//           </div>
//         </dl>

//         <div className="Vcompany-edit-delete-btn-outer">
//           <div className="Vcompany-edit-delete-btn-inner">
//             <span onClick={() => router.push(`/superadmin/companies/edit/${company.company_id}`)}
//               className="buttons"
//               title="Edit">
//               Edit Company
//             </span>
//             <span onClick={() => router.push(`/superadmin/companies/delete/${company.company_id}`)}
//               className="buttons"
//               title="Delete">
//               Delete Company
//             </span>
//           </div>
//         </div>

//         <div className="vc-proofs">
//           {company.business_proof_front && (
//             <figure className="vc-proof">
//               <figcaption>Front Proof Document</figcaption>
//               <Image
//                 src={`/${company.business_proof_front}`}
//                 alt="Front Proof"
//                 width={400}
//                 height={300}
//                 style={{ objectFit: 'contain' }}
//               />
//             </figure>
//           )}
//           {company.business_proof_back && (
//             <figure className="vc-proof">
//               <figcaption>Back Proof Document</figcaption>
//               <Image
//                 src={`/${company.business_proof_back}`}
//                 alt="Back Proof"
//                 width={400}
//                 height={300}
//                 style={{ objectFit: 'contain' }}
//               />
//             </figure>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewCompanyPage;







"use client";
import React, { useEffect } from 'react';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import { useParams } from 'next/navigation';
import { useFetchSingleCompanyQuery } from '@/slices/superadminSlices/company/companyApi';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaEdit, FaTrashAlt, FaFileAlt } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

const ViewCompanyPage = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Company Profile');
  }, [setTitle]);

  const { id } = useParams();
  const { data, isLoading, error } = useFetchSingleCompanyQuery(id as string);
  const router = useRouter();

  const company = data?.data as unknown as {
    id: number;
    admin_id: number | null;
    company_name: string;
    company_id: string;
    company_slug: string;
    business_address: string;
    pin_code: string;
    business_proof_type: string;
    business_id: string;
    business_proof_front?: string;
    business_proof_back?: string;
    Company_logo?: string;
    payment_status: string;
    verification_status: string;
  };

  if (!company) return <div>Company not found.</div>;
  if (isLoading) return <div>Loading company details...</div>;
  if (error) return <div>Error loading company details.</div>;

  return (
    <div>
      <div className='vC-back-btn'>
        <Link href="/superadmin/companies" className='back-button'>
          <FaArrowLeft size={16} color='#fff' />
        </Link>
      </div>
      <div className="vc-modern-container">
        {/* Header Section */}
        <div className="vc-modern-header">
          <div className="vc-header-main">
            {/* Logo Section */}
            {company.Company_logo && (
              <div className="vc-company-logo-wrapper">
                <Image
                  src={`/${company.Company_logo}`}
                  alt="Company Logo"
                  width={80}
                  height={80}
                  className="vc-company-logo"
                />
              </div>
            )}
            <div className="vc-header-text">
              <h1 className="vc-company-name">{company.company_name}</h1>
              <div className="vc-company-meta">
                <span className="vc-company-id">ID: {company.company_id}</span>
                <span className="vc-company-slug">Slug: {company.company_slug}</span>
              </div>
            </div>
            <div className="vc-status-container">
              <span className={`vc-status vc-status-${company.verification_status}`}>
                {company.verification_status.replace('_', ' ')}
              </span>
              <span className={`vc-status vc-status-${company.payment_status}`}>
                {company.payment_status.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="vc-modern-grid">
          {/* Left Column - Company Details */}
          <div className="vc-details-section">
            <div className="vc-details-card">
              <h3 className="vc-section-title">
                <FaFileAlt className="vc-title-icon" />
                Company Information
              </h3>

              <div className="vc-detail-grid">
                <DetailItem label="System ID" value={company.id} />
                <DetailItem label="Admin ID" value={company.admin_id || 'N/A'} />
                <DetailItem label="Business Address" value={company.business_address} />
                <DetailItem label="PIN Code" value={company.pin_code} />
                <DetailItem label="Business ID" value={company.business_id} />
                <DetailItem label="Proof Type" value={company.business_proof_type} />
              </div>
            </div>

            <div className="vc-action-buttons">
              <button
                onClick={() => router.push(`/superadmin/companies/edit/${company.company_id}`)}
                className="vc-action-btn vc-edit-btn"
              >
                <FaEdit /> Edit Profile
              </button>
              <button
                onClick={() => router.push(`/superadmin/companies/delete/${company.company_id}`)}
                className="vc-action-btn vc-delete-btn"
              >
                <FaTrashAlt /> Delete Company
              </button>
            </div>
          </div>

          {/* Right Column - Documents */}
          <div className="vc-documents-section">
            <div className="vc-documents-card">
              <h3 className="vc-section-title">
                <FaFileAlt className="vc-title-icon" />
                Business Documents
              </h3>

              <div className="vc-documents-grid">
                <DocumentCard
                  title="Front Proof"
                  url={company.business_proof_front}
                />
                <DocumentCard
                  title="Back Proof"
                  url={company.business_proof_back}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const DetailItem = ({ label, value }: { label: string; value: string | number }) => (
  <div className="vc-detail-item">
    <dt className="vc-detail-label">{label}</dt>
    <dd className="vc-detail-value">{value}</dd>
  </div>
);

const DocumentCard = ({ title, url }: { title: string; url?: string }) => (
  <div className="vc-document-card">
    <div className="vc-document-header">{title}</div>
    <div className="vc-document-preview">
      {url ? (
        <Image
          src={`/${url}`}
          alt={title}
          fill
          style={{ objectFit: 'cover' }}
          className="vc-document-image"
        />
      ) : (
        <div className="vc-document-missing">Not Available</div>
      )}
    </div>
  </div>

);

export default ViewCompanyPage;