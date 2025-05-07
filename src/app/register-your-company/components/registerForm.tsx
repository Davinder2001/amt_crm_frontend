'use client';

import React, { useEffect, useState } from 'react';
import { useAdminRegisterMutation } from '@/slices/auth/authApi';
import { FiUpload, FiUser, FiMail, FiPhone, FiLock, FiHome, FiGlobe, FiFileText, FiCreditCard, FiEyeOff, FiEye, FiFile, FiXCircle } from 'react-icons/fi';
import ConfirmDialog from '@/components/common/ConfirmDialog';


const LOCAL_STORAGE_KEY = 'adminregistration';

const getStoredFormData = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }
  return null;
};

const saveFormData = (data: Partial<RegisterForm>) => {
  if (typeof window !== 'undefined') {
    const dataToStore = { ...data };
    // Remove File fields
    Object.keys(dataToStore).forEach(key => {
      if (dataToStore[key as keyof RegisterForm] instanceof File) {
        delete dataToStore[key as keyof RegisterForm];
      }
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToStore));
  }
};

const getDefaultFormData = (): RegisterForm => ({
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

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterForm>(getDefaultFormData());
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeSection, setActiveSection] = useState<'personal' | 'company' | 'documents'>('personal');
  const [adminRegister, { isLoading }] = useAdminRegisterMutation();
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof RegisterForm, string>>>({});
  const [showPassword, setShowPassword] = useState({
    password: false,
    password_confirmation: false
  });

  useEffect(() => {
    const stored = getStoredFormData();
    if (stored) {
      setFormData(prev => ({ ...prev, ...stored }));
    }
  }, []);


  const validatePersonalSection = () => {
    const errors: Partial<Record<keyof RegisterForm, string>> = {};
    if (!formData.first_name) errors.first_name = 'First name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.number) errors.number = 'Mobile number is required';
    if (!formData.password) errors.password = 'Password is required';

    // Confirm password logic
    if (!formData.password_confirmation) {
      errors.password_confirmation = 'Please confirm your password';
    } else if (formData.password !== formData.password_confirmation) {
      errors.password_confirmation = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateCompanySection = () => {
    const errors: Partial<Record<keyof RegisterForm, string>> = {};

    if (!formData.company_name) errors.company_name = 'Company name is required';
    if (!formData.business_address) errors.business_address = 'Business address is required';
    if (!formData.pin_code) errors.pin_code = 'Pin code is required';
    if (!formData.business_id) errors.business_id = 'Business ID is required';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const togglePasswordVisibility = (field: 'password' | 'password_confirmation') => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
  
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    saveFormData(updatedFormData);
  
    const newErrors: Record<string, string> = { ...fieldErrors };
  
    if (name === 'password') {
      if (!value) {
        newErrors.password = 'Password is required';
      } else if (value.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else {
        delete newErrors.password;
      }
  
      if (updatedFormData.password_confirmation) {
        if (updatedFormData.password_confirmation.length < 8) {
          newErrors.password_confirmation = 'Confirm password must be at least 8 characters';
        } else if (value !== updatedFormData.password_confirmation) {
          newErrors.password_confirmation = 'Passwords do not match';
        } else {
          delete newErrors.password_confirmation;
        }
      }
  
    } else if (name === 'password_confirmation') {
      if (!value) {
        newErrors.password_confirmation = 'Please confirm your password';
      } else if (value.length < 8) {
        newErrors.password_confirmation = 'Confirm password must be at least 8 characters';
      } else if (value !== updatedFormData.password) {
        newErrors.password_confirmation = 'Passwords do not match';
      } else {
        delete newErrors.password_confirmation;
      }
  
    } else if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) {
        newErrors.email = 'Email is required';
      } else if (!emailRegex.test(value)) {
        newErrors.email = 'Invalid email format';
      } else {
        delete newErrors.email;
      }
  
    } else if (name === 'number') {
      const numberRegex = /^[0-9]{10}$/; // Example: 10-digit phone number
      if (!value.trim()) {
        newErrors.number = 'Phone number is required';
      } else if (!numberRegex.test(value)) {
        newErrors.number = 'Enter a valid 10-digit number';
      } else {
        delete newErrors.number;
      }
  
    } else {
      if (value.trim()) {
        delete newErrors[name];
      }
    }
  
    setFieldErrors(newErrors);
  };  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof RegisterForm) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData(prev => ({ ...prev, [field]: files[0] }));
    }
  };

  const handleClearForm = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setFormData(getDefaultFormData());
    setShowConfirm(false);
    setActiveSection('personal')
    setFieldErrors({})
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePersonalSection() || !validateCompanySection()) return;

    const data = new FormData();

    // Auto-append all string/number fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        data.append(key, value);
      }
    });

    try {
      const response = await adminRegister(data).unwrap();
      localStorage.removeItem('adminregistration');
      setActiveSection('personal');
      setFormData(getDefaultFormData());
      console.log('Registration successful:', response);
    } catch {
      alert('Something went wrong. Please check the form and try again.');
    }
  };

  const renderInputField = (
    label: string,
    name: keyof RegisterForm,
    type: string,
    required: boolean,
    icon: React.ReactNode,
  ) => (
    <div className="form-group">
      <label>
        {icon}
        <span>{label}</span>
        {required && <span className="required">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={formData[name] as string}
          onChange={handleChange}
          required={required}
          rows={3}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name] as string}
          onChange={handleChange}
          required={required}
        />
      )}
      {fieldErrors[name] && <p className="input-error">{fieldErrors[name]}</p>}
    </div>
  );

  const renderFileUpload = (
    label: string,
    name: keyof RegisterForm,
    required: boolean,
    description?: string
  ) => (
    <div className="file-upload-group">
      <label>
        <FiFile />
        <span>{label}</span>
        {required && <span className="required">*</span>}
      </label>
      <div className="file-upload-container">
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={e => handleFileChange(e, name)}
          required={required}
        />
        <div className="file-upload-box">
          <FiUpload className="upload-icon" />
          <span>Click to upload or drag and drop</span>
          {description && <small>{description}</small>}
        </div>
        {formData[name] && (
          <div className="file-preview">
            {(formData[name] as File).name}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="register-company-container">
      <div className="register-header">
        <h1>Create Your Business Account</h1>
        <p>Register your company to get started with our platform</p>
      </div>

      <div className="register-stepper">
        <div
          className={`step ${activeSection === 'personal' ? 'active' : ''}`}
          onClick={() => { setActiveSection('personal'); }}
        >
          <span>1</span>
          Personal Details
        </div>
        <div
          className={`step ${activeSection === 'company' ? 'active' : ''}`}
          onClick={() => {
            if (activeSection === 'personal' && validatePersonalSection()) {
              setActiveSection('company');
            } else if (activeSection !== 'personal') {
              setActiveSection('company');
            }
          }}
        >
          <span>2</span>
          Company Details
        </div>
        <div
          className={`step ${activeSection === 'documents' ? 'active' : ''}`}
          onClick={() => {
            if (
              validatePersonalSection() &&
              validateCompanySection()
            ) {
              setActiveSection('documents');
            }
          }}
        >
          <span>3</span>
          Documents
        </div>
      </div>


      <form onSubmit={handleSubmit} className="register-form">
        <ConfirmDialog
          isOpen={showConfirm}
          message="Are you sure you want to clear the form?"
          onConfirm={handleClearForm}
          onCancel={() => setShowConfirm(false)}
        />
        <span className="clear-button" onClick={() => setShowConfirm(true)}><FiXCircle /></span>

        {activeSection === 'personal' && (
          <div className="form-section">
            <h2>
              <FiUser />
              Personal Information
            </h2>
            <div className="form-grid">
              {renderInputField('First Name', 'first_name', 'text', true, <FiUser />)}
              {renderInputField('Last Name', 'last_name', 'text', false, <FiUser />)}
              {renderInputField('Email', 'email', 'email', true, <FiMail />)}
              {renderInputField('Mobile Number', 'number', 'tel', true, <FiPhone />)}
              <div className="form-group password-group">
                <label>
                  <FiLock />
                  <span>Password</span>
                  <span className="required">*</span>
                </label>
                <div className="input-group">
                  <input
                    type={showPassword.password ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <span
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('password')}
                  >
                    {showPassword.password ? <FiEyeOff /> : <FiEye />}
                  </span>
                </div>
                {fieldErrors.password && <p className="input-error">{fieldErrors.password}</p>}
              </div>

              <div className="form-group password-group">
                <label>
                  <FiLock />
                  <span>Confirm Password</span>
                  <span className="required">*</span>
                </label>
                <div className={`input-group ${formData.password !== formData.password_confirmation ? 'invalid' : ''}`}>
                  <input
                    type={showPassword.password_confirmation ? 'text' : 'password'}
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                  />
                  <span
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('password_confirmation')}
                  >
                    {showPassword.password_confirmation ? <FiEyeOff /> : <FiEye />}
                  </span>
                </div>
                {fieldErrors.password_confirmation && <p className="input-error">{fieldErrors.password_confirmation}</p>}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'company' && (
          <div className="form-section">
            <h2>
              <FiHome />
              Company Information
            </h2>
            <div className="form-grid">
              {renderInputField('Company Name', 'company_name', 'text', true, <FiHome />)}
              {renderInputField('Business Address', 'business_address', 'text', true, <FiHome />)}
              {renderInputField('Pin Code', 'pin_code', 'text', true, <FiHome />)}
              {renderInputField('Business ID', 'business_id', 'text', true, <FiFileText />)}
              {renderInputField('Website URL', 'website_url', 'url', false, <FiGlobe />)}
            </div>
          </div>
        )}

        {activeSection === 'documents' && (
          <div className="form-section">
            <h2>
              <FiFileText />
              Document Verification
            </h2>
            <div className="document-grid">
              <div className="document-section">
                <h3>Business Proof</h3>
                <div className="form-group">
                  <label>
                    <FiFileText />
                    <span>Business Proof Type</span>
                    <span className="required">*</span>
                  </label>
                  <select
                    name="business_proof_type"
                    value={formData.business_proof_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Proof Type</option>
                    <option value="gst">GST Certificate</option>
                    <option value="trade_license">Trade License</option>
                    <option value="incorporation">Certificate of Incorporation</option>
                  </select>
                </div>
                {renderFileUpload('Business Proof Front', 'business_proof_image_front', true, 'Max 5MB, JPG/PNG/PDF')}
                {renderFileUpload('Business Proof Back', 'business_proof_image_back', false, 'Optional')}
              </div>

              <div className="document-section">
                <h3>Identity Proof</h3>
                {renderInputField('Aadhar Number', 'aadhar_number', 'text', true, <FiCreditCard />,)}
                {renderFileUpload('Aadhar Front', 'aadhar_image_front', true)}
                {renderFileUpload('Aadhar Back', 'aadhar_image_back', true)}
              </div>

              <div className="document-section">
                <h3>Tax Information</h3>
                {renderInputField('PAN Number', 'pan_number', 'text', true, <FiFileText />)}
                {renderFileUpload('PAN Front', 'pan_image_front', true)}
                {renderFileUpload('PAN Back', 'pan_image_back', true)}
              </div>

              <div className="document-section">
                <h3>Additional Documents</h3>
                {renderFileUpload('Office Electricity Bill', 'office_electricity_bill', false, 'Optional address proof')}
              </div>
            </div>
          </div>
        )}

        <div className="form-navigation">
          {activeSection !== 'personal' && (
            <button
              type="button"
              className="secondary-button"
              onClick={() => setActiveSection(activeSection === 'company' ? 'personal' : 'company')}
            >
              Previous
            </button>
          )}
          {activeSection !== 'documents' ? (
            <button
              type="button"
              className="primary-button"
              onClick={() => {
                if (activeSection === 'personal' && validatePersonalSection()) {
                  setActiveSection('company');
                } else if (activeSection === 'company' && validateCompanySection()) {
                  setActiveSection('documents');
                }
              }}
            >
              Next
            </button>
          ) : (
            <button type="submit" className="complete-registration" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Processing...
                </>
              ) : (
                'Complete Registration'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;