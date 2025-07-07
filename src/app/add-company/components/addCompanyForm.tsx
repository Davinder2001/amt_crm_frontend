'use client';
import React, { useState } from "react";
import { useOrderNewCompanyMutation } from "@/slices";

interface AddCompany {
  company_name: string;
  package_id: number;
  limit_id: number;
  variant_type: string;
  business_category_id: number | null;
  company_logo: File | null;
  business_address: string;
  pin_code: string;
  business_proof_type: string;
  business_id: string;
  business_proof_front: File | null;
  business_proof_back: File | null;
}

interface AddCompanyFormProps {
  packageId: number;
  limitId: number;
  variantType: string;
  categoryId: number | null;
}

const Page: React.FC<AddCompanyFormProps> = ({
  packageId,
  limitId,
  variantType,
  categoryId
}) => {
  const [formData, setFormData] = useState<AddCompany>({
    company_name: '',
    package_id: packageId,
    limit_id: limitId,
    variant_type: variantType,
    business_category_id: categoryId,
    company_logo: null,
    business_address: '',
    pin_code: '',
    business_proof_type: '',
    business_id: '',
    business_proof_front: null,
    business_proof_back: null,
  });

  const [orderNewCompany, { isLoading }] = useOrderNewCompanyMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (formData.business_category_id === null) {
        throw new Error("Business category is required.");
      }

      const payload = new FormData();
      payload.append('company_name', formData.company_name);
      payload.append('package_id', formData.package_id.toString());
      payload.append('limit_id', formData.limit_id.toString());
      payload.append('subscription_type', formData.variant_type);
      payload.append('business_category_id', formData.business_category_id.toString());
      payload.append('business_address', formData.business_address);
      payload.append('pin_code', formData.pin_code);
      payload.append('business_proof_type', formData.business_proof_type);
      payload.append('business_id', formData.business_id);
      if (formData.company_logo) payload.append('company_logo', formData.company_logo);
      if (formData.business_proof_front) payload.append('business_proof_front', formData.business_proof_front);
      if (formData.business_proof_back) payload.append('business_proof_back', formData.business_proof_back);

      const response = await orderNewCompany(payload).unwrap();

      if (response.payment.redirect_url) {
        window.location.href = response.payment.redirect_url;
      }
    } catch (err) {
      console.error("Failed to start payment:", err);
    }
  };

  return (
    <div className="add-company">
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="company-form">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Company Name *</label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter company name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Company Logo</label>
            <div className="file-upload">
              <input
                type="file"
                name="company_logo"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
              <span className="file-label">
                {formData.company_logo ? formData.company_logo.name : 'Choose file...'}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">PIN Code</label>
            <input
              type="text"
              name="pin_code"
              value={formData.pin_code}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter PIN code"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Business Proof Type</label>
            <input
              type="text"
              name="business_proof_type"
              value={formData.business_proof_type}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. GST, PAN, etc."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Business ID</label>
            <input
              type="text"
              name="business_id"
              value={formData.business_id}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter business ID"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Business Proof Front</label>
            <div className="file-upload">
              <input
                type="file"
                name="business_proof_front"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
              <span className="file-label">
                {formData.business_proof_front ? formData.business_proof_front.name : 'Choose file...'}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Business Proof Back</label>
            <div className="file-upload">
              <input
                type="file"
                name="business_proof_back"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
              <span className="file-label">
                {formData.business_proof_back ? formData.business_proof_back.name : 'Choose file...'}
              </span>
            </div>
          </div>

          <div className="form-group full-width">
            <label className="form-label">Business Address</label>
            <textarea
              name="business_address"
              value={formData.business_address}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Enter business address"
              rows={3}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={isLoading}
            className="buttons"
          >
            {isLoading ? "Processing..." : "Create Company"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;