"use client";
import React, { useEffect } from 'react';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import { useParams } from 'next/navigation';
import { useFetchSingleCompanyQuery } from '@/slices/superadminSlices/company/companyApi';
import { FaFileAlt } from 'react-icons/fa';
import Image from 'next/image';
import { adminlogo } from "@/assets/useImage";
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import { FaTriangleExclamation } from 'react-icons/fa6';

const ViewCompanyPage = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Company Profile');
  }, [setTitle]);

  const { id } = useParams();
  const { data, isLoading, error } = useFetchSingleCompanyQuery(id as string);

  const getStatusClass = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized === 'verified') return 'vc-status-success';
    if (normalized === 'pending') return 'vc-status-warning';
    if (['rejected', 'blocked'].includes(normalized)) return 'vc-status-danger';
    return 'vc-status-default';
  };

  const company = data?.data as unknown as {
    id: number;
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

  if (isLoading) return <Loader />;
  if (error) return (
    <EmptyState
      icon={<FaTriangleExclamation className='empty-state-icon' />}
      title="Error loading companies."
      message="Something went wrong while loading  details."
    />);

  return (
    <>
      <div className="vc-modern-container">
        {/* Header Section */}
        <div className="vc-modern-header">
          <div className="vc-header-main">
            <div className="vc-company-logo">
              <Image
                src={
                  company.Company_logo && company.Company_logo.trim() !== ''
                    ? company.Company_logo.startsWith('@/assets/useImage') // full URL
                      ? company.Company_logo
                      : `/${company.Company_logo}` // relative to public folder
                    : adminlogo.src // fallback imported image
                }
                alt={`${company.company_name} Logo`}
                width={110}
                height={110}
                style={{ objectFit: 'cover', borderRadius: '50%' }}
                priority
              />

              <div className="vc-header-text">
                <div className="vc-company-header">
                  <h1 className="vc-company-name">{company.company_name}</h1>

                </div>
                <div className="vc-company-meta">
                  <span className="vc-company-id">ID: {company.company_id}</span>
                  <span className="vc-company-slug">Slug: {company.company_slug}</span>
                </div>
              </div>
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
                <DetailItem label="Business Address" value={company.business_address} />
                <DetailItem label="PIN Code" value={company.pin_code} />
                <DetailItem label="Business ID" value={company.business_id} />
                <DetailItem label="Proof Type" value={company.business_proof_type} />
                <DetailItem
                  label="Verification Status"
                  value={company.verification_status.replace("_", " ")}
                  className={`vc-status ${getStatusClass(company.verification_status)}`}
                />
                <DetailItem label="Payment Status" value={company.payment_status} />



              </div>
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
    </>
  );
};

// Reusable Components
const DetailItem = ({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string | number;
  className?: string;
}) => (
  <div className="vc-detail-item">
    <dt className="vc-detail-label">{label}</dt>
    <dd className={`vc-detail-value ${className}`.trim()}>{value}</dd>
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
        <div className="vc-document-missing ">Not Available</div>
      )}
    </div>
  </div>

);

export default ViewCompanyPage;