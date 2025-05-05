// 'use client';

// import React, { useState } from 'react';
// import { useAdminRegisterMutation } from '@/slices/auth/authApi';

// interface RegisterForm {
//   first_name: string;
//   last_name: string;
//   email: string;
//   password: string;
//   password_confirmation: string;
//   company_name: string;
//   number: string;
//   business_address: string;
//   pin_code: string;
//   business_proof_type: string;
//   business_id: string;
//   aadhar_number: string;
//   pan_number: string;
//   website_url: string;
//   business_proof_image_front: File | null;
//   business_proof_image_back?: File | null;
//   aadhar_image_front?: File | null;
//   aadhar_image_back?: File | null;
//   pan_image_front?: File | null;
//   pan_image_back?: File | null;
//   office_electricity_bill?: File | null;
// }

// const RegisterForm: React.FC = () => {
//   const [formData, setFormData] = useState<RegisterForm>({
//     first_name: '',
//     last_name: '',
//     email: '',
//     password: '',
//     password_confirmation: '',
//     company_name: '',
//     number: '',
//     business_address: '',
//     pin_code: '',
//     business_proof_type: '',
//     business_id: '',
//     aadhar_number: '',
//     pan_number: '',
//     website_url: '',
//     business_proof_image_front: null,
//     business_proof_image_back: null,
//     aadhar_image_front: null,
//     aadhar_image_back: null,
//     pan_image_front: null,
//     pan_image_back: null,
//     office_electricity_bill: null,
//   });

//   const [adminRegister, { isLoading }] = useAdminRegisterMutation();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     field: keyof RegisterForm
//   ) => {
//     const files = e.target.files;
//     if (files && files.length > 0) {
//       setFormData(prev => ({ ...prev, [field]: files[0] }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const data = new FormData();

//     Object.entries(formData).forEach(([key, value]) => {
//       if (value instanceof File) {
//         data.append(key, value, value.name);
//       } else if (value !== null && value !== undefined) {
//         data.append(key, value);
//       } else {
//         data.append(key, '');
//       }
//     });

//     // ✅ Log each key-value pair in FormData
//     console.log('🚀 FormData being submitted:');
//     for (const [key, val] of data.entries()) {
//       console.log(`${key}:`, val);
//     }

//     try {
//       const response = await adminRegister(data).unwrap();
//       console.log('✅ Registration successful:', response);
//     } catch (error) {
//       const err = error as { data?: { message?: string; errors?: Record<string, string[]> } };
//       if (err?.data?.errors) {
//         console.error('❌ Backend Validation Errors:', err.data.errors);
//       } else {
//         console.error('❌ Registration failed:', err);
//       }
//     }
//   };


//   return (
//     <div className="register-company-form">
//       <form onSubmit={handleSubmit} className="form-container">
//         <div className="form-grid">
//           {[
//             ['First Name', 'first_name', 'text', true],
//             ['Last Name', 'last_name', 'text', false],
//             ['Email', 'email', 'email', true],
//             ['Password', 'password', 'password', true],
//             ['Confirm Password', 'password_confirmation', 'password', true],
//             ['Company Name', 'company_name', 'text', true],
//             ['Mobile Number', 'number', 'text', true],
//             ['Business Address', 'business_address', 'text', true],
//             ['Pin Code', 'pin_code', 'text', true],
//             ['Business ID', 'business_id', 'text', true],
//             ['Website URL', 'website_url', 'url', false],
//           ].map(([label, name, type, required]) => (
//             <div className="form-group" key={String(name)}>
//               <label>{label}</label>
//               <input
//                 type={type as string}
//                 name={name as string}
//                 value={formData[name as keyof RegisterForm] as string}
//                 onChange={handleChange}
//                 required={required as boolean}
//               />
//             </div>
//           ))}

//           {/* Office Electricity Bill */}
//           <section className="office-bill-section">
//             <h2>Office Electricity Bill (Optional)</h2>
//             <div className="form-group">
//               <label>Upload Bill</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={e => handleFileChange(e, 'office_electricity_bill')}
//               />
//             </div>
//           </section>

//           {/* Business Proof Files */}
//           <section className="business-proof-section">
//             <h2>Business Proof:</h2>
//             {/* Business Proof Type Select */}
//             <div className="form-group">
//               <label>Business Proof Type</label>
//               <select
//                 name="business_proof_type"
//                 value={formData.business_proof_type}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select Type</option>
//                 <option value="option1">Option 1</option>
//                 <option value="option2">Option 2</option>
//                 <option value="option3">Option 3</option>
//               </select>
//             </div>
//             <div className="form-group">
//               <label>Business Proof Front (Required)</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={e => handleFileChange(e, 'business_proof_image_front')}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label>Business Proof Back (Optional)</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={e => handleFileChange(e, 'business_proof_image_back')}
//               />
//             </div>
//           </section>

//           {/* Aadhar Details */}
//           <section className="aadhar-section">
//             <h2>Aadhar Details:</h2>
//             <div className="form-group">
//               <label>Aadhar Number</label>
//               <input
//                 type="text"
//                 name="aadhar_number"
//                 value={formData.aadhar_number}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="form-group">
//               <label>Aadhar Front (Optional)</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={e => handleFileChange(e, 'aadhar_image_front')}
//               />
//             </div>
//             <div className="form-group">
//               <label>Aadhar Back (Optional)</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={e => handleFileChange(e, 'aadhar_image_back')}
//               />
//             </div>
//           </section>

//           {/* PAN Details */}
//           <section className="pan-section">
//             <h2>PAN Details:</h2>
//             <div className="form-group">
//               <label>PAN Number</label>
//               <input
//                 type="text"
//                 name="pan_number"
//                 value={formData.pan_number}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="form-group">
//               <label>PAN Front (Optional)</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={e => handleFileChange(e, 'pan_image_front')}
//               />
//             </div>
//             <div className="form-group">
//               <label>PAN Back (Optional)</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={e => handleFileChange(e, 'pan_image_back')}
//               />
//             </div>
//           </section>


//         </div>

//         <button type="submit" disabled={isLoading} className="submit-button">
//           {isLoading ? 'Registering...' : 'Register'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default RegisterForm;









'use client';

import React, { useState } from 'react';
import { useAdminRegisterMutation } from '@/slices/auth/authApi';
import { FiUpload, FiUser, FiMail, FiPhone, FiLock, FiHome, FiGlobe, FiFileText, FiCreditCard } from 'react-icons/fi';

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

  const [activeSection, setActiveSection] = useState<'personal' | 'company' | 'documents'>('personal');
  const [adminRegister, { isLoading }] = useAdminRegisterMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof RegisterForm) => {
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
      }
    });

    try {
      const response = await adminRegister(data).unwrap();
      console.log('Registration successful:', response);
    } catch (error) {
      console.error('Registration failed:', error);
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
        <FiUpload />
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
          onClick={() => setActiveSection('personal')}
        >
          <span>1</span>
          Personal Details
        </div>
        <div
          className={`step ${activeSection === 'company' ? 'active' : ''}`}
          onClick={() => setActiveSection('company')}
        >
          <span>2</span>
          Company Details
        </div>
        <div
          className={`step ${activeSection === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveSection('documents')}
        >
          <span>3</span>
          Documents
        </div>
      </div>

      <form onSubmit={handleSubmit} className="register-form">
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
              {renderInputField('Password', 'password', 'password', true, <FiLock />)}
              {renderInputField('Confirm Password', 'password_confirmation', 'password', true, <FiLock />)}
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
                {renderInputField('Aadhar Number', 'aadhar_number', 'text', false, <FiCreditCard />)}
                {renderFileUpload('Aadhar Front', 'aadhar_image_front', false)}
                {renderFileUpload('Aadhar Back', 'aadhar_image_back', false)}
              </div>

              <div className="document-section">
                <h3>Tax Information</h3>
                {renderInputField('PAN Number', 'pan_number', 'text', false, <FiFileText />)}
                {renderFileUpload('PAN Front', 'pan_image_front', false)}
                {renderFileUpload('PAN Back', 'pan_image_back', false)}
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
              onClick={() => setActiveSection(activeSection === 'personal' ? 'company' : 'documents')}
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