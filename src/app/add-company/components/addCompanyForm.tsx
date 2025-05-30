'use client';
import React, { useEffect, useState } from "react";
import { useOrderNewCompanyMutation } from "@/slices/company/companyApi";

interface addCompanyFormProps {
  packageId: number;
  categoryId: number | null;
}

const LOCAL_STORAGE_KEY = 'addCompany';

const getStoredFormData = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }
  return null;
};

const saveFormData = (data: Partial<AddCompany>) => {
  if (typeof window !== 'undefined') {
    const dataToStore = { ...data };
    Object.keys(dataToStore).forEach(key => {
      if (dataToStore[key as keyof AddCompany] instanceof File) {
        delete dataToStore[key as keyof AddCompany];
      }
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToStore));
  }
};

const getDefaultFormData = (packageId: number, categoryId: number | null): AddCompany => ({
  company_name: '',
  package_id: packageId,
  business_category_id: categoryId,
  company_logo: null,
  business_address: '',
  pin_code: '',
  business_proof_type: '',
  business_id: '',
  business_proof_front: null,
  business_proof_back: null,
});

const Page: React.FC<addCompanyFormProps> = ({ packageId, categoryId }) => {
  const [formData, setFormData] = useState<AddCompany>(getDefaultFormData(packageId, categoryId));
  const [orderNewCompany, { isLoading }] = useOrderNewCompanyMutation();

  useEffect(() => {
    const stored = getStoredFormData();
    if (stored) {
      setFormData(prev => ({ ...prev, ...stored }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    saveFormData(updatedFormData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.business_category_id === null) {
        throw new Error("Business category is required.");
      }
      const payload = {
        business_category_id: formData.business_category_id,
        package_id: formData.package_id,
        company_name: formData.company_name,
        buiness_id: formData.business_id ?? "",
      };
      const response = await orderNewCompany(payload).unwrap();
      localStorage.setItem("addCompany", JSON.stringify({ ...formData, order_id: response.orderId }));

      if (response.redirect_url) {
        window.location.href = response.redirect_url;
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
              <button type="button" className="file-button">Browse</button>
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
              <button type="button" className="file-button">Browse</button>
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
              <button type="button" className="file-button">Browse</button>
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
            className="submit-button"
          >
            {isLoading ? "Processing..." : "Create Company"}
          </button>
        </div>
      </form>


    </div>
  );
}

export default Page;