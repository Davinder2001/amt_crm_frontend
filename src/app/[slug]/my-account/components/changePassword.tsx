'use client';
import React, { useState } from 'react';
import { useChangePasswordMutation } from '@/slices/auth/authApi';
import { FaEye, FaEyeSlash, FaKey, FaLock } from 'react-icons/fa';
import { changepass } from '@/assets/useImage';
import { FaCircleCheck } from 'react-icons/fa6';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [changePassword, { isLoading, isSuccess, isError }] = useChangePasswordMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    changePassword({ oldPassword, newPassword })
      .unwrap()
      .then(() => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
      })
      .catch((err) => {
        const message = err?.data?.message || 'Failed to change password';
        setError(message);
        console.error(err);
      });
  };

  return (
    <div className="change-pass-container">
      <div className="form-container">
        <h2 className="title">Secure Your Account</h2>
        <p className="subtitle">Your privacy matters. Update your password anytime.</p>
        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <FaLock className="icon" />
            <input
              type={showOldPassword ? 'text' : 'password'}
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="input"
            />
            {showOldPassword ? (
              <FaEyeSlash className="icon toggle-eye" onClick={() => setShowOldPassword(false)} />
            ) : (
              <FaEye className="icon toggle-eye" onClick={() => setShowOldPassword(true)} />
            )}
          </div>

          <div className="input-group">
            <FaKey className="icon" />
            <input
              type={showNewPassword ? 'text' : 'password'}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="input"
            />
            {showNewPassword ? (
              <FaEyeSlash className="icon toggle-eye" onClick={() => setShowNewPassword(false)} />
            ) : (
              <FaEye className="icon toggle-eye" onClick={() => setShowNewPassword(true)} />
            )}
          </div>

          <div className="input-group">
            <FaCircleCheck
              className="icon"
              style={{
                color:
                  confirmPassword.length === 0
                    ? '#009693'
                    : confirmPassword === newPassword
                      ? '#01A601'
                      : '#EA1C20',
              }}
            />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="input"
            />
            {showConfirmPassword ? (
              <FaEyeSlash className="icon toggle-eye" onClick={() => setShowConfirmPassword(false)} />
            ) : (
              <FaEye className="icon toggle-eye" onClick={() => setShowConfirmPassword(true)} />
            )}
          </div>


          {error && <p className="error">{error}</p>}
          {isError && <p className="error">Something went wrong, please try again.</p>}
          {isSuccess && <p className="success">Password changed successfully!</p>}
          <button type="submit" disabled={isLoading} className="button">
            {isLoading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
      <div className="image-container">
        <img src={changepass.src} alt="Doctors" className="illustration" />

      </div>
    </div>
  );
};

export default ChangePassword;
