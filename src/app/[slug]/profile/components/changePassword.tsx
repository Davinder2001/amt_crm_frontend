import React, { useState } from 'react';
import { useChangePasswordMutation } from '@/slices/auth/authApi'; // Import the mutation hook

const ChangePassword = () => {
  // Local state for form inputs
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Use the changePassword mutation hook
  const [changePassword, { isLoading, isSuccess, isError }] = useChangePasswordMutation();

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Call the changePassword mutation, sending oldPassword, newPassword
    changePassword({ oldPassword, newPassword })
      .unwrap()
      .then(() => {
        // Handle success
        alert('Password changed successfully');
      })
      .catch((err) => {
        // Handle error
        setError('Failed to change password');
        console.error(err);
      });
  };

  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Old Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Changing...' : 'Change Password'}
        </button>
        {isError && <p style={{ color: 'red' }}>Something went wrong, please try again.</p>}
        {isSuccess && <p style={{ color: 'green' }}>Password changed successfully!</p>}
      </form>
    </div>
  );
};

export default ChangePassword;
