'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/slices/auth/authApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useUser } from '@/provider/UserContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Image from 'next/image';
import { loginImage } from '@/assets/useImage';

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
      } else if (result.user.user_type === 'employee') {
        if (result.user.companies && result.user.companies.length === 1) {
          const companySlug = result.user.companies[0].company_slug;
          Cookies.set('company_slug', companySlug, { path: '/' });
          router.push(`/${companySlug}/dashboard`);
        } else {
          // Multiple companies, let them choose or go to the home page
          router.push('/');
        }
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

  return (
    <>
      <div className="login-page-container">
        <div className="login-header">
          <h1>Welcome to Your App!</h1>
          <p>Sign in to continue and explore all the amazing features.</p>
        </div>

        <div className="login-layout-wrapper">
          <div className="login-image-container">
            <Image src={loginImage.src} alt="Login" className="login-image" width={200} height={200} />
          </div>
          <div className="login-card">
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

                <button type="submit" className="login-button" disabled={isLoading}>
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
        </div>

        <div className="features-section">
          <h2>Why Choose Us?</h2>
          <div className="features-container">
            <div className="feature">
              <h3>Feature 1</h3>
              <p>Our app allows you to do XYZ with ease and efficiency. It&apos;s fast and secure.</p>
            </div>
            <div className="feature">
              <h3>Feature 2</h3>
              <p>Enjoy seamless integration with other services and quick setup for your team.</p>
            </div>
            <div className="feature">
              <h3>Feature 3</h3>
              <p>Access your data anywhere with our cross-platform support for mobile and desktop.</p>
            </div>
          </div>
        </div>

        <div className="testimonials">
          <h2>What Our Users Are Saying</h2>
          <div className="testimonial-container">
            <div className="testimonial">
              <p>&quot;This app is fantastic! It has made my workflow so much easier.&quot; - User A</p>
            </div>
            <div className="testimonial">
              <p>&quot;The features are amazing, and I can&apos;t imagine going back to what I was using before.&quot; - User B</p>
            </div>
            <div className="testimonial">
              <p>&quot;Great support and easy to use. Highly recommend!&quot; - User C</p>
            </div>
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
