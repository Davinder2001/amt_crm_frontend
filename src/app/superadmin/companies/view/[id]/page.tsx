"use client";
import React, { useEffect } from 'react'
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import { useParams } from 'next/navigation';
import { useFetchSingleCompanyQuery } from '@/slices/superadminSlices/company/companyApi';
import { useRouter } from 'next/navigation';
import { FaArrowLeft} from 'react-icons/fa';
import Image from 'next/image';

const ViewCompanyPage = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Company View'); // Update breadcrumb title
  }, [setTitle]);

  const { id } = useParams();
  const { data, isLoading, error } = useFetchSingleCompanyQuery(id as string);
  const router = useRouter();

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
  if (isLoading) return <div>Loading company details...</div>;
  if (error) return <div>Error loading company details.</div>;
  return (
    <div className="vc-container">
      <div className='vC-back-btn'>
        <button
          onClick={() => router.back()}
          className="buttons"
        >
          <FaArrowLeft />Back
        </button>
      </div>
      <div className="vc-inner-container">

        <header className="vc-header">
          <h1 className="vc-title">{company.company_name}</h1>
          <p className="vc-subtitle">
            ID: {company.company_id} &nbsp;|&nbsp; Slug: {company.company_slug}
          </p>
        </header>

        <dl className="vc-grid">
          <div className="vc-item">
            <dt>Verification Status:</dt>
            <dd>{company.verification_status.replace('_', ' ')}</dd>
          </div>
          <div className="vc-item">
            <dt>Payment Status:</dt>
            <dd>{company.payment_status.replace('_', ' ')}</dd>
          </div>
          <div className="vc-item">
            <dt>Business Address:</dt>
            <dd>{company.business_address}</dd>
          </div>
          <div className="vc-item">
            <dt>Business ID:</dt>
            <dd>{company.business_id}</dd>
          </div>
          <div className="vc-item">
            <dt>Proof Type:</dt>
            <dd>{company.business_proof_type}</dd>
          </div>
          <div className="vc-item">
            <dt>PIN Code:</dt>
            <dd>{company.pin_code}</dd>
          </div>
        </dl>
        <div className="Vcompany-edit-delete-btn-outer">
          <div className="Vcompany-edit-delete-btn-inner">
            <span onClick={() => router.push(`/superadmin/companies/edit/${company.company_id}`)}
              className="buttons"
              title="Edit">
              Edit item
            </span>
            <span onClick={() => router.push(`/superadmin/companies/delete/${company.company_id}`)}
              className="buttons"
              title="Delete">
              Delete item
            </span>
          </div>
        </div>

        {(company.business_proof_front || company.business_proof_back) && (
          <div className="vc-proofs">
            {company.business_proof_front && (
              <figure className="vc-proof">
                <figcaption>Proof Front</figcaption>
                <Image src={`/${company.business_proof_front}`} alt="Front Proof" width={200} height={200} />
              </figure>
            )}
            {company.business_proof_back && (
              <figure className="vc-proof">
                <figcaption>Proof Back</figcaption>
                <Image src={`/${company.business_proof_back}`} alt="Back Proof" width={200} height={200} />
              </figure>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCompanyPage;
