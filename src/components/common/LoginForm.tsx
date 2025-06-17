'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/slices/auth/authApi';
import { toast } from 'react-toastify';
import Image from "next/image";
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useUser } from '@/provider/UserContext';
import { FaEye, FaEyeSlash, FaFingerprint } from 'react-icons/fa';
import { FiLock } from 'react-icons/fi';
import { loginPageimage } from '@/assets/useImage';
import { MdSmartphone } from 'react-icons/md';
import Loader from './Loader';
import { encodeStorage } from '@/utils/Company';

const LoginForm = () => {
  const router = useRouter();
  const { setUser, user, authChecked } = useUser();
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [login, { isLoading }] = useLoginMutation();

  // Redirect if already logged in
  const redirectUser = React.useCallback((userData: UserProfile) => {
    let redirectPath = '/';
    if (userData.user_type === 'admin') {
      redirectPath = '/';
    } else if (userData.user_type === 'employee') {
      const companySlug = userData.companies[0].company_slug;
      Cookies.set('company_slug', companySlug, { path: '/' });
      localStorage.setItem('company_slug', encodeStorage(companySlug));
      redirectPath = `/${companySlug}/employee/dashboard`;
    } else if (userData.user_type === 'super-admin') {
      redirectPath = '/superadmin/dashboard';
    }
    router.replace(redirectPath);
  }, [router]);

  useEffect(() => {
    if (authChecked && user) {
      redirectUser(user);
      setInitialCheckDone(true);
    } else if (authChecked) {
      setInitialCheckDone(true);
    }
  }, [user, authChecked, redirectUser]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ number, password }).unwrap();
      toast.success(result.message);

      // Set auth tokens
      Cookies.set('access_token', result.access_token, { path: '/' });
      Cookies.set('user_type', result.user.user_type, { path: '/' });
      localStorage.setItem('access_token', encodeStorage(result.access_token));
      localStorage.setItem('user_type', encodeStorage(result.user.user_type));

      // Update context and redirect
      setUser(result.user);
      redirectUser(result.user);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    }
  };

  if (!initialCheckDone) {
    return <Loader />;
  }

  if (user) {
    return <Loader />;
  }


  return (
    <>
      <div className="login-container2">
        {isLoading && <Loader />}
        <div className="left-panel">
          <div className="form-box">
            <h1 className="title">Welcome back <span className='wave-hand'>👋🏻</span></h1>
            <p className="description">Please login to manage your dashboard.</p>

            {!isLoading && (
              <form onSubmit={handleLogin} className="login-form">


                <div className="input-group">
                  <label>Mobile Number</label>
                  <div className="input-wrapper filled">
                    <MdSmartphone size={18} className="input-icon" />
                    <input
                      type="text"
                      placeholder="Enter your mobile number..."
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      className="login-input"
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Password</label>
                  <div className="input-wrapper filled">
                    <FiLock size={18} className="input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="password-input"
                      required
                    />
                    <span
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>




                <div className="remember-forgot ">
                  <label className="custom-checkbox">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="checkmark">
                      <FaFingerprint className="checkmark-icon" />
                    </span>
                    Remember me
                  </label>
                  <Link href="/forget-password" className="forgot-password-link">Forgot Password?</Link>
                </div>

                <button type="submit" className="login-button" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : (
                    <>
                      Login
                    </>
                  )}
                </button>

              </form>
            )}



            <div className="login-footer-links">
              <span>don&apos;t have any account?</span>
              <Link href="/register" className="register-company-link">
                Register
              </Link>
            </div>
          </div>
        </div>

        <div className="right-panel">
          <Image
            src={loginPageimage.src}
            alt="Doctors"
            className="illustration"
            width={600} // adjust width
            height={400} // adjust height
            priority // optional: loads image earlier for better UX
          />
        </div>
      </div>

    </>
  );
};

export default LoginForm;
