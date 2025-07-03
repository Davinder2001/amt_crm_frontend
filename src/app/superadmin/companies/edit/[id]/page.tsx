'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import Image from 'next/image';
import {
  useFetchSingleCompanyQuery,
  useUpdateCompanyMutation,
} from '@/slices/superadminSlices/company/companyApi';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';

interface Company {
  id: number;
  company_name: string;
  company_slug: string;
  business_address: string;
  business_proof_type: string;
  business_id: string;
  pin_code: string;
  payment_status: 'paid' | 'pending' | '';
  verification_status: 'verified' | 'pending' | '';
  business_proof_front: string;
  business_proof_back?: string;
}

interface FormDataState {
  company_name: string;
  company_slug: string;
  payment_status: string;
  verification_status: string;
  business_address: string;
  business_proof_type: string;
  business_id: string;
  pin_code: string;
}

const EditCompanyPage = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Edit Company'); // Update breadcrumb title
  }, [setTitle]);
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const router = useRouter();

  const {
    data: companyResponse,
    isLoading,
    error,
  } = useFetchSingleCompanyQuery(id);

  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();

  const [formData, setFormData] = useState<FormDataState>({
    company_name: '',
    company_slug: '',
    payment_status: '',
    verification_status: '',
    business_address: '',
    business_proof_type: '',
    business_id: '',
    pin_code: '',
  });

  useEffect(() => {
    if (companyResponse?.data) {
      const company = (companyResponse.data && typeof companyResponse.data === 'object' && 'id' in companyResponse.data)
        ? (companyResponse.data as Company)
        : null;
      setFormData({
        company_name: company?.company_name ?? '',
        company_slug: company?.company_slug ?? '',
        payment_status: company?.payment_status ?? '',
        verification_status: company?.verification_status ?? '',
        business_address: company?.business_address ?? '',
        business_proof_type: company?.business_proof_type ?? '',
        business_id: company?.business_id ?? '',
        pin_code: company?.pin_code ?? '',
      });
    }
  }, [companyResponse]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCompany({ id, data: formData as Partial<Company> }).unwrap();
      alert('Company updated!');
      router.push('/superadmin/companies');
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const isImage = (url: string) => /\.(jpg|jpeg|png|webp)$/i.test(url);

  if (isLoading) return <LoadingState />;
  if (error || !companyResponse?.data) return (
    <EmptyState
      icon="alert"
      title="Error loading companies."
      message="Something went wrong while loading companies."
    />);

  const company = (companyResponse.data && typeof companyResponse.data === 'object' && 'id' in companyResponse.data)
    ? (companyResponse.data as Company)
    : null;

  return (
    <div className="edit-company-wrapper">
      <form onSubmit={handleSubmit} className="edit-company-form">
        {([
          ['Company Name', 'company_name'],
          ['Slug', 'company_slug'],
          ['Business Address', 'business_address'],
          ['Business ID', 'business_id'],
          ['PIN Code', 'pin_code'],
          ['Proof Type (e.g., GST, PAN)', 'business_proof_type'],
        ] as [string, keyof FormDataState][]).map(([label, name]) => (
          <div key={name} className="form-group">
            <label>{label}</label>
            <input
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <div className="form-group">
          <label>Payment Status</label>
          <select
            name="payment_status"
            value={formData.payment_status}
            onChange={handleChange}
            required
          >
            <option value="">Select Payment Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="form-group">
          <label>Verification Status</label>
          <select
            name="verification_status"
            value={formData.verification_status}
            onChange={handleChange}
            required
          >
            <option value="">Select Verification Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {company?.business_proof_front && (
          <div className="form-group">
            <label>Business Proof Front</label>
            {isImage(company.business_proof_front) ? (
              <div className="image-preview">
                <Image
                  src={company.business_proof_front}
                  alt="Business Proof Front"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            ) : (
              <a
                href={company.business_proof_front}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Business Proof Front
              </a>
            )}
          </div>
        )}

        {company?.business_proof_back && (
          <div className="form-group">
            <label>Business Proof Back</label>
            {isImage(company.business_proof_back) ? (
              <div className="image-preview">
                <Image
                  src={company.business_proof_back}
                  alt="Business Proof Back"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            ) : (
              <a
                href={company.business_proof_back}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Business Proof Back
              </a>
            )}
          </div>
        )}

        <button type="submit" disabled={isUpdating} className='buttons'>
          {isUpdating ? 'Updating...' : 'Update Company'}
        </button>
      </form>
    </div>
  );
};

export default EditCompanyPage;
