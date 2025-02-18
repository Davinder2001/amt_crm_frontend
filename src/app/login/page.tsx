'use client'
import React, { useState } from 'react';
import { useLoginMutation } from '@/slices/users/userApi'; 

const Page = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [login, { isLoading: isLoggingIn, error: loginError }] = useLoginMutation();

  const handleLogin = async () => {
    try {
      setErrorMessage('');
      const response = await login({ username, password }).unwrap();
      console.log('Logged in:', response);

    } catch (error) {
      console.log('Login failed:', error);
      setErrorMessage('Login failed. Please try again.');
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin} disabled={isLoggingIn}>
          {isLoggingIn ? 'Logging in...' : 'Login'}
        </button>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Page;
