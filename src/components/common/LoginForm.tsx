'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/slices/auth/authApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useUser } from '@/provider/UserContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Image from 'next/image';
import { logo } from '@/assets/useImage';

const LoginForm = () => {
  const router = useRouter();
  const { setUser, user } = useUser();
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await login({ number, password }).unwrap();
      toast.success(result.message);

      console.log('Login result:', result);

      // Set cookies
      Cookies.set('access_token', result.access_token, { path: '/' });
      Cookies.set('user_type', result.user.user_type, { path: '/' });

      // Update user in context
      setUser(result.user);

      // Log the user to ensure it's updated
      console.log('Updated user:', result.user);

      // Redirect based on user type
      if (result.user.user_type === 'admin') {
        router.push('/');  // Admin goes to the root page
        router.refresh();
      } else if (result.user.user_type === 'employee') {
        const companySlug = result.user.companies[0].company_slug;
        Cookies.set('company_slug', companySlug, { path: '/' });
        router.push(`/${companySlug}/employee/dashboard`);
      } else if (result.user.user_type === 'super-admin') {
        router.push('/superadmin/dashboard')
      } else {
        // Multiple companies, let them choose or go to the home page
        router.push('/');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || 'Login failed');
      } else {
        toast.error('An unknown error occurred');
      }
    }
  };

  const isLoggedIn = !!user;

  useEffect(() => {
    const accessToken = Cookies.get('access_token');
    const userType = Cookies.get('user_type');
    if (!accessToken && !userType) {
      setUser(null);
    }
  }, [setUser, user]);

  return (
    <>
      <div className="login-page-container">
        <div className="c-logo">
          <Link href={`${user?.user_type === "employee" ? "/employee/dashboard" : "/"}`} className="logo-wrapper"><Image src={logo.src} alt="logo" width={50} height={50} /> <h1>AMT CRM</h1></Link>
        </div>
        <div className="login-header">
          <h1>Welcome to Asset Management Technology!</h1>
          <p>Sign in to continue and explore all the amazing features.</p>
        </div>

        <div className="login-form-wrapper">
          {isLoggedIn ? (
            ''
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

              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="password-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button type="submit" className="buttons" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          )}

          <div className="links">
            <Link href="/forget-password" className="forgot-password-link">
              Forget Password
            </Link>
            <Link href="/register-your-company" className="register-company-link">
              Register your company
            </Link>
          </div>
        </div>
        <div className="formfooter">
          <p>&copy; 2025 Your Company. All rights reserved.</p>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
