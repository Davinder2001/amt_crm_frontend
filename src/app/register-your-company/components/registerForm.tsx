'use client'
import React, { useState } from 'react';
import { useAdminRegisterMutation } from '@/slices/auth/authApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    company_name: '',
    number: '',
  });
  const [backendResponse, setBackendResponse] = useState<string | null>(null);
  const [adminRegister] = useAdminRegisterMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('handleSubmit called');
    try {
      const result = await adminRegister(formData).unwrap();
      toast.success('Registration successful!');
      console.log('Registration successful:', result);
      setBackendResponse(JSON.stringify(result, null, 2));
      // Uncomment the next line if you wish to clear the form on success:
      // setFormData({ name: '', email: '', password: '', password_confirmation: '', company_name: '', number: '' });
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.data?.errors) {
        // Loop through each error field and print each error message.
        for (const key in err.data.errors) {
          err.data.errors[key].forEach((message: string) => {
            toast.error(`${key}: ${message}`);
          });
        }
      } else {
        toast.error('Registration failed. Please try again.');
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Admin Registration</h2>
        <div>
          <label htmlFor="name">Name:</label>
          <input 
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required 
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input 
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required 
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input 
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required 
          />
        </div>
        <div>
          <label htmlFor="password_confirmation">Confirm Password:</label>
          <input 
            type="password"
            id="password_confirmation"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            required 
          />
        </div>
        <div>
          <label htmlFor="company_name">Company Name:</label>
          <input 
            type="text"
            id="company_name"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            required 
          />
        </div>
        <div>
          <label htmlFor="number">Number:</label>
          <input 
            type="text"
            id="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            required 
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {backendResponse && (
        <div>
          <h3>Backend Response:</h3>
          <pre>{backendResponse}</pre>
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default RegisterForm;
