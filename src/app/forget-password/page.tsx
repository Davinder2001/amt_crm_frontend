'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForgotPasswordMutation, useVerifyOtpMutation } from '@/slices';
import { toast, ToastContainer } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import { MdCheckCircle, MdPassword, MdPhonelinkLock } from 'react-icons/md';
import { IoMdCloseCircle } from 'react-icons/io';
import 'react-toastify/dist/ReactToastify.css';
import { forgotPageimage } from '@/assets/useImage';

interface ErrorResponse {
  data?: {
    errors?: {
      [key: string]: string[];
    };
  };
  message?: string;
}

const ResetPasswordForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [stage, setStage] = useState<'email' | 'otp' | 'reset'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const [forgotPassword, { isLoading: isSendingOtp }] = useForgotPasswordMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
      toast.success('OTP sent to your email.');
      setStage('otp');
    } catch (err) {
      const error = err as ErrorResponse;
      const errorMessage = error?.data?.errors?.email?.[0] || 'Failed to send OTP.';
      toast.error(errorMessage);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      await verifyOtp({
        email,
        otp,
        password: newPassword,
        password_confirmation: confirmPassword,
      }).unwrap();

      toast.success('OTP verified successfully. Your password is now reset.');
      setStage('reset');
      router.push('/login');
    } catch (err) {
      const error = err as ErrorResponse;
      const errorMessage = error?.data?.errors?.otp?.[0] || 'Failed to verify OTP.';
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <section className="forgot-p-form-wrapper">
        <div className="forgot-p-form-container">
          <div className="login-container2 Forgot-pass-login-container">
            <div className="left-panel">
              <div className="left-panel-inner">
                {stage === 'email' && (
                  <form onSubmit={handleEmailSubmit}>
                    <h1 className="title">Forgot your password?</h1>
                    <p className="description">We’ll help you reset it in a few steps.</p>

                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <div className="input-wrapper filled">
                        <FiMail size={18} className="input-icon" />
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="Enter your email..."
                        />
                      </div>
                    </div>

                    <button type="submit" className="sendOTP-button" disabled={isSendingOtp}>
                      {isSendingOtp ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                  </form>
                )}

                {stage === 'otp' && (
                  <form onSubmit={handleOtpSubmit}>
                    <div className="form-group otp-lable-input-wraper">
                      <label htmlFor="otp">OTP:</label>
                      <div className="password-container input-wrapper filled">
                        <MdPhonelinkLock size={18} className="input-icon" />
                        <input
                          type="text"
                          id="otp"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                          placeholder="Enter OTP"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="newPassword">New Password:</label>
                      <div className="password-container input-wrapper filled">
                        <MdPassword size={18} className="input-icon" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="newPassword"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          placeholder="New Password"
                        />
                        <span
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirm Password:</label>
                      <div className="password-container input-wrapper filled">
                        {confirmPassword ? (
                          confirmPassword === newPassword ? (
                            <MdCheckCircle size={18} className="input-icon" style={{ color: '#01A601' }} />
                          ) : (
                            <IoMdCloseCircle size={18} className="input-icon" style={{ color: '#f62020' }} />
                          )
                        ) : (
                          <MdCheckCircle size={18} className="input-icon" style={{ color: '#009693' }} />
                        )}

                        <input
                          type={showPasswordConfirmation ? 'text' : 'password'}
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          placeholder="Confirm New Password"
                        />

                        <span
                          className="password-toggle"
                          onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                        >
                          {showPasswordConfirmation ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="submit-button sendOTP-button"
                      disabled={isVerifyingOtp}
                    >
                      {isVerifyingOtp ? 'Verifying OTP...' : 'Verify OTP & Reset Password'}
                    </button>
                  </form>
                )}

                {stage === 'reset' && <p>Password has been reset successfully!</p>}
              </div>
            </div>

            <div className="right-panel">
              <Image
                src={forgotPageimage}
                alt="Illustration"
                className="illustration"
                width={500}
                height={500}
                priority // for faster LCP
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          </div>
        </div>
      </section>

      <ToastContainer />
    </>
  );
};

export default ResetPasswordForm;
