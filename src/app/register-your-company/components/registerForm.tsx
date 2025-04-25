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
  business_proof_image_front: File | null;
  business_proof_image_back?: File | null;
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
    business_proof_image_front: null,
    business_proof_image_back: null,
  });

  const [adminRegister, { isLoading }] = useAdminRegisterMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'business_proof_image_front' | 'business_proof_image_back'
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData(prev => ({ ...prev, [field]: files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();

    // Append fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof File) {
        data.append(key, value, value.name);
      } else if (value !== null && value !== undefined) {
        data.append(key, value);
      } else {
        data.append(key, '');
      }
    });

    // Debug: Log FormData
    for (const [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await adminRegister(data).unwrap();
      console.log('✅ Registration successful:', response);
    } catch (error) {
      const err = error as { data?: { errors?: unknown } };
      if (err?.data?.errors) {
        console.error('❌ Backend Validation Errors:', err.data.errors);
      } else {
        console.error('❌ Registration failed:', err);
      }
    }
  };

  return (
    <section className="form-wrapper">
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
            ['Business Proof Type', 'business_proof_type', 'text', true],
            ['Business ID', 'business_id', 'text', true],
            ['Aadhar Number', 'aadhar_number', 'text', false],
            ['Pan Number', 'pan_number', 'text', false],
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

          <div className="form-group">
            <label>Front Image (Required)</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => handleFileChange(e, 'business_proof_image_front')}
              required
            />
          </div>

          <div className="form-group">
            <label>Back Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => handleFileChange(e, 'business_proof_image_back')}
            />
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="submit-button">
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <style jsx>{`
        .form-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 50px 0;
          background: #f9f9f9;
        }
        .form-container {
          padding: 30px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-top: 20px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        label {
          font-weight: 600;
          margin-bottom: 8px;
          color: #333;
        }
        input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          transition: border 0.3s;
        }
        input:focus {
          border-color: #009693;
          outline: none;
        }
        .submit-button {
          width: 100%;
          padding: 12px;
          background: #009693;
          border: none;
          border-radius: 8px;
          color: #fff;
          font-size: 18px;
          margin-top: 30px;
          cursor: pointer;
        }
        .submit-button:hover {
          background: #01a601;
        }
      `}</style>
    </section>
  );
};

export default RegisterForm;
