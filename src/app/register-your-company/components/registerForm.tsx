'use client';

import React, { useState } from 'react';
import { useAdminRegisterMutation } from '@/slices/auth/authApi';

interface RegisterForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  company_name: string;
  number: string;
  business_address: string;
  pin_code: string;
  business_proof_type: string;
  business_id: string;
  aadhar_number: string;
  pan_number: string;
  website_url: string;
  business_proof_image_front: File | null;
  business_proof_image_back?: File | null;
  aadhar_image_front?: File | null;
  aadhar_image_back?: File | null;
  pan_image_front?: File | null;
  pan_image_back?: File | null;
  office_electricity_bill?: File | null;
}

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterForm>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    company_name: '',
    number: '',
    business_address: '',
    pin_code: '',
    business_proof_type: '',
    business_id: '',
    aadhar_number: '',
    pan_number: '',
    website_url: '',
    business_proof_image_front: null,
    business_proof_image_back: null,
    aadhar_image_front: null,
    aadhar_image_back: null,
    pan_image_front: null,
    pan_image_back: null,
    office_electricity_bill: null,
  });

  const [adminRegister, { isLoading }] = useAdminRegisterMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof RegisterForm
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData(prev => ({ ...prev, [field]: files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof File) {
        data.append(key, value, value.name);
      } else if (value !== null && value !== undefined) {
        data.append(key, value);
      } else {
        data.append(key, '');
      }
    });

    // ✅ Log each key-value pair in FormData
    console.log('🚀 FormData being submitted:');
    for (const [key, val] of data.entries()) {
      console.log(`${key}:`, val);
    }

    try {
      const response = await adminRegister(data).unwrap();
      console.log('✅ Registration successful:', response);
    } catch (error) {
      const err = error as { data?: { message?: string; errors?: Record<string, string[]> } };
      if (err?.data?.errors) {
        console.error('❌ Backend Validation Errors:', err.data.errors);
      } else {
        console.error('❌ Registration failed:', err);
      }
    }
  };


  return (
    <div className="register-company-form">
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-grid">
          {[
            ['First Name', 'first_name', 'text', true],
            ['Last Name', 'last_name', 'text', false],
            ['Email', 'email', 'email', true],
            ['Password', 'password', 'password', true],
            ['Confirm Password', 'password_confirmation', 'password', true],
            ['Company Name', 'company_name', 'text', true],
            ['Mobile Number', 'number', 'text', true],
            ['Business Address', 'business_address', 'text', true],
            ['Pin Code', 'pin_code', 'text', true],
            ['Business ID', 'business_id', 'text', true],
            ['Website URL', 'website_url', 'url', false],
          ].map(([label, name, type, required]) => (
            <div className="form-group" key={String(name)}>
              <label>{label}</label>
              <input
                type={type as string}
                name={name as string}
                value={formData[name as keyof RegisterForm] as string}
                onChange={handleChange}
                required={required as boolean}
              />
            </div>
          ))}

          {/* Office Electricity Bill */}
          <section className="office-bill-section">
            <h2>Office Electricity Bill (Optional)</h2>
            <div className="form-group">
              <label>Upload Bill</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => handleFileChange(e, 'office_electricity_bill')}
              />
            </div>
          </section>

          {/* Business Proof Files */}
          <section className="business-proof-section">
            <h2>Business Proof:</h2>
            {/* Business Proof Type Select */}
            <div className="form-group">
              <label>Business Proof Type</label>
              <select
                name="business_proof_type"
                value={formData.business_proof_type}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </select>
            </div>
            <div className="form-group">
              <label>Business Proof Front (Required)</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => handleFileChange(e, 'business_proof_image_front')}
                required
              />
            </div>
            <div className="form-group">
              <label>Business Proof Back (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => handleFileChange(e, 'business_proof_image_back')}
              />
            </div>
          </section>

          {/* Aadhar Details */}
          <section className="aadhar-section">
            <h2>Aadhar Details:</h2>
            <div className="form-group">
              <label>Aadhar Number</label>
              <input
                type="text"
                name="aadhar_number"
                value={formData.aadhar_number}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Aadhar Front (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => handleFileChange(e, 'aadhar_image_front')}
              />
            </div>
            <div className="form-group">
              <label>Aadhar Back (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => handleFileChange(e, 'aadhar_image_back')}
              />
            </div>
          </section>

          {/* PAN Details */}
          <section className="pan-section">
            <h2>PAN Details:</h2>
            <div className="form-group">
              <label>PAN Number</label>
              <input
                type="text"
                name="pan_number"
                value={formData.pan_number}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>PAN Front (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => handleFileChange(e, 'pan_image_front')}
              />
            </div>
            <div className="form-group">
              <label>PAN Back (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => handleFileChange(e, 'pan_image_back')}
              />
            </div>
          </section>


        </div>

        <button type="submit" disabled={isLoading} className="submit-button">
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
