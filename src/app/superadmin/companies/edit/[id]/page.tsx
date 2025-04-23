'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFetchSingleCompanyQuery, useUpdateCompanyMutation } from '@/slices/superadminSlices/company/companyApi';

const EditCompanyPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading, error } = useFetchSingleCompanyQuery(id as string);
  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();

  const [formData, setFormData] = useState({
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
    if (data?.data) {
      const company = data.data;
      setFormData({
        company_name: company.company_name || '',
        company_slug: company.company_slug || '',
        payment_status: company.payment_status || '',
        verification_status: company.verification_status || '',
        business_address: company.business_address || '',
        business_proof_type: company.business_proof_type || '',
        business_id: company.business_id || '',
        pin_code: company.pin_code || '',
      });
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCompany({ id: id as string, data: formData }).unwrap();
      alert('Company updated!');
      router.push('/superadmin/companies');
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|webp)$/i.test(url);
  };

  if (isLoading) return <div>Loading company...</div>;
  if (error) return <div>Error loading company.</div>;

  const company = data?.data;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Edit Company</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium mb-1">Company Name</label>
          <input
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            name="company_slug"
            value={formData.company_slug}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Business Address</label>
          <input
            name="business_address"
            value={formData.business_address}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Business ID</label>
          <input
            name="business_id"
            value={formData.business_id}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">PIN Code</label>
          <input
            name="pin_code"
            value={formData.pin_code}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Proof Type (e.g., GST, PAN)</label>
          <input
            name="business_proof_type"
            value={formData.business_proof_type}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Payment Status</label>
          <select
            name="payment_status"
            value={formData.payment_status}
            onChange={handleChange}
            className="border p-2 w-full"
          >
            <option value="">Select Payment Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Verification Status</label>
          <select
            name="verification_status"
            value={formData.verification_status}
            onChange={handleChange}
            className="border p-2 w-full"
          >
            <option value="">Select Verification Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {company?.business_proof_front && (
          <div>
            <label className="block text-sm font-medium mb-1">Business Proof Front</label>
            {isImage(company.business_proof_front) ? (
              <img
                src={company.business_proof_front}
                alt="Business Proof Front"
                className="border rounded max-w-full h-48 object-contain"
              />
            ) : (
              <a
                href={company.business_proof_front}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Business Proof Front
              </a>
            )}
          </div>
        )}

        {company?.business_proof_back && (
          <div>
            <label className="block text-sm font-medium mb-1">Business Proof Back</label>
            {isImage(company.business_proof_back) ? (
              <img
                src={company.business_proof_back}
                alt="Business Proof Back"
                className="border rounded max-w-full h-48 object-contain"
              />
            ) : (
              <a
                href={company.business_proof_back}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Business Proof Back
              </a>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isUpdating}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {isUpdating ? 'Updating...' : 'Update Company'}
        </button>
      </form>
    </div>
  );
};

export default EditCompanyPage;
