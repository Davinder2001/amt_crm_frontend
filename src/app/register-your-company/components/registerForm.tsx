'use client';
import React, { useState } from 'react';
import { useAdminRegisterMutation } from '@/slices/auth/authApi';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
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
  const [adminRegister] = useAdminRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const result = await adminRegister(formData).unwrap();
      if (result.message) {
        toast.success(result.message);
      }
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <>
      <section className="form-wrapper">
        <form onSubmit={handleSubmit} className="form-container">
          <h2>Admin Registration</h2>
          <p className="form-subtitle">Please fill in the details to register as an admin.</p>

          <div className="form-grid">
            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="name">Full Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email address"
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <div className="password-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label htmlFor="password_confirmation">Confirm Password:</label>
              <div className="password-container">
                <input
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  id="password_confirmation"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                >
                  {showPasswordConfirmation ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Company Name Field */}
            <div className="form-group">
              <label htmlFor="company_name">Company Name:</label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
                placeholder="Enter your company name"
              />
            </div>

            {/* Phone Number Field */}
            <div className="form-group">
              <label htmlFor="number">Phone Number:</label>
              <input
                type="text"
                id="number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <button type="submit" className="submit-button">Register</button>
        </form>
      </section>

      <style jsx>{`
        .form-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 50px 0;
          background: #f9f9f9;
        }

        .form-container {
          max-width: 700px;
          width: 100%;
          padding: 30px;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease-in-out;
        }
        h2 {
          text-align: center;
          font-size: 32px;
          font-weight: 700;
          color: #222222;
          margin-bottom: 15px;
        }

        .form-subtitle {
          text-align: center;
          font-size: 16px;
          color: #888888;
          margin-bottom: 30px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
          color: #333333;
        }

        input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          color: #333333;
          margin-bottom: 5px;
          transition: border 0.3s ease;
        }

        input:focus {
          border-color: #009693;
          outline: none;
        }

        .password-container {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #888888;
        }

        .submit-button {
          width: 100%;
          padding: 10px;
          background-color: #009693;
          border: none;
          border-radius: 8px;
          color: #ffffff;
          font-size: 18px;
          cursor: pointer;
          margin-top: 20px;
        }
        .submit-button:hover{
        background-color: #01A601;
        }
      `}</style>
    </>
  );
};

export default RegisterForm;
