'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/slices/auth/authApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useUser } from '@/provider/UserContext';

const LoginForm = () => {
  const router = useRouter();
  const { setUser, user } = useUser();
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await login({ number, password }).unwrap();
      toast.success('Login successful');

      // Set cookies
      Cookies.set('access_token', result.access_token, { path: '/' });
      Cookies.set('user_type', result.user.user_type, { path: '/' });

      // Redirect to user's company_slug URL
      if (result?.user?.company_slug) {
        router.push(`/${result.user.company_slug}/dashboard`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Login failed");
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  const handleLogout = () => {
    Cookies.remove('access_token');
    Cookies.remove('user_type');
    Cookies.remove('company_slug');
    setUser(null);
    router.push('/');
    toast.success('Logged out successfully!');
  };

  const isLoggedIn = !!user;

  return (
    <div className=''>
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-header">
            {isLoggedIn ? `Welcome, ${user?.name || "User"}!` : "Login"}
          </h2>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          ) : (
            <form onSubmit={handleLogin} className="login-form">
              <input
                type="text"
                placeholder="Phone Number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="login-input"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                required
              />
              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          )}
        </div>
        <Link href="/forget-password" className="forgot-password-link">
          Forget Password
        </Link>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginForm;
