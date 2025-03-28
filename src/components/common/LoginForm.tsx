'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginMutation, useLogoutMutation } from '@/slices/auth/authApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useUser } from '@/provider/UserContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginForm = () => {
  const router = useRouter();
  const { setUser, user } = useUser();

  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();
  const [logout] = useLogoutMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await login({ number, password }).unwrap();
      toast.success(result.message);

      // Set cookies
      Cookies.set('access_token', result.access_token, { path: '/' });
      Cookies.set('user_type', result.user.user_type, { path: '/' });

      // Update user in context
      setUser(result.user);

      // Navigate
      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || 'Login failed');
      } else {
        toast.error('An unknown error occurred');
      }
    }
  };

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response && 'data' in response && response.data?.message) {
        toast.success(response.data.message);

        // Clear cookies
        Cookies.remove('access_token');
        Cookies.remove('user_type');
        Cookies.remove('company_slug');

        // Clear context
        setUser(null);

        // Redirect
        router.push('/login');
        router.refresh();
      } else {
        toast.error(response?.data?.message || 'Logout failed');
      }
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const isLoggedIn = !!user;

  // Lint fix: include setUser in dependency array
  useEffect(() => {
    const accessToken = Cookies.get('access_token');
    const userType = Cookies.get('user_type');
    if (!accessToken || !userType) {
      setUser(null); // Clear context if cookies are missing
    }
  }, [setUser]);

  return (
    <div>
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-header">
            {isLoggedIn ? `Welcome, ${user?.name || 'User'}!` : 'Login'}
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

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
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
