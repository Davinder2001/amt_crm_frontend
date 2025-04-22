'use client';
import React, { useState } from 'react';
import { useAdminRegisterMutation } from '@/slices/auth/authApi';
import { useFetchCompaniesNameQuery } from '@/slices/superadminSlices/company/companyApi';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

interface FormData {
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
}

const RegisterForm: React.FC = () => {
  const { data: companiesData = { companies: [] } } = useFetchCompaniesNameQuery();
  const [formData, setFormData] = useState<FormData>({
    first_name: '', last_name: '', email: '', password: '', password_confirmation: '',
    company_name: '', number: '', business_address: '', pin_code: '',
    business_proof_type: '', business_id: ''
  });

  const [companyValid, setCompanyValid] = useState(true);
  const [adminRegister, { isLoading }] = useAdminRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'company_name') setCompanyValid(true);
  };

  const handleCompanyBlur = () => {
    const name = formData.company_name.trim().toLowerCase();
    if (!name) return;
    const exists = companiesData?.companies?.some(
      (company: any) => company.company_name.toLowerCase() === name
    );
    if (exists) {
      setCompanyValid(false);
      toast.error('This business name is already registered');
    } else {
      setCompanyValid(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyValid) return;

    try {
      const payload = { ...formData };
      const result = await adminRegister(payload).unwrap();
      toast.success(result.message || 'Registered successfully');
    } catch (err: any) {
      if (err.data?.errors) {
        Object.values(err.data.errors).flat().forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(err.data?.message || 'Registration failed');
      }
    }
  };

  return (
    <section className="form-wrapper">
      <form onSubmit={handleSubmit} className="form-container">
        <h2>Admin Registration</h2>

        <div className={`form-group full-width ${!companyValid ? 'has-error' : ''}`}>
          <label htmlFor="company_name">Business Name</label>
          <input
            id="company_name"
            name="company_name"
            type="text"
            value={formData.company_name}
            onChange={handleChange}
            onBlur={handleCompanyBlur}
            required
            placeholder="Enter your company name"
          />
        </div>

        <div className="form-grid">
          {[
            { label: 'First Name', name: 'first_name' },
            { label: 'Last Name', name: 'last_name' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Phone Number', name: 'number' },
            { label: 'Business Address', name: 'business_address' },
            { label: 'Pin Code', name: 'pin_code' },
            { label: 'Business Proof Type', name: 'business_proof_type' },
            { label: 'Business ID Number', name: 'business_id' }
          ].map(({ label, name, type = 'text' }) => (
            <div className="form-group" key={name}>
              <label htmlFor={name}>{label}</label>
              <input
                id={name}
                name={name}
                type={type}
                value={(formData as any)[name]}
                onChange={handleChange}
                required
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            </div>
          ))}

          {/* Password Fields */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-container">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create password"
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(prev => !prev)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password_confirmation">Confirm Password</label>
            <div className="password-container">
              <input
                id="password_confirmation"
                name="password_confirmation"
                type={showPasswordConfirmation ? 'text' : 'password'}
                value={formData.password_confirmation}
                onChange={handleChange}
                required
                placeholder="Re-enter password"
              />
              <button type="button" className="password-toggle" onClick={() => setShowPasswordConfirmation(prev => !prev)}>
                {showPasswordConfirmation ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </div>

        <button type="submit" disabled={isLoading || !companyValid} className="submit-button">
          {isLoading ? 'Registering…' : 'Register'}
        </button>
      </form>

      <style jsx>{`
        .form-wrapper { display: flex; justify-content: center; align-items: center; padding: 50px 0; background: #f9f9f9; }
        .form-container { padding: 30px; background: #fff; border-radius: 12px; box-shadow: 0 6px 15px rgba(0,0,0,0.1); }
        h2 { text-align:center; font-size:32px; margin-bottom:15px; color:#222; }
        .form-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:20px; margin-top:20px; }
        .form-group { display:flex; flex-direction:column; }
        .full-width { grid-column:1/-1; }
        .has-error input { border-color:#e74c3c; }
        label { font-weight:600; margin-bottom:8px; color:#333; }
        input { padding:10px; border:1px solid #ddd; border-radius:8px; font-size:16px; transition:border 0.3s; }
        input:focus { border-color:#009693; outline:none; }
        .password-container { position:relative; }
        .password-toggle { position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#888; }
        .submit-button { width:100%; padding:12px; background:#009693; border:none; border-radius:8px; color:#fff; font-size:18px; margin-top:30px; cursor:pointer; }
        .submit-button:hover { background:#01a601; }
      `}</style>
    </section>
  );
};

export default RegisterForm;
