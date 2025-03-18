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

      // ✅ Set cookies
      Cookies.set('access_token', result.access_token, { path: '/' });
      Cookies.set('user_type', result.user.user_type, { path: '/' });
      Cookies.set('company_slug', result.user.company_slug, { path: '/' });

      // ✅ Update context state
      setUser(result.user);

      // ✅ Redirect to home
      router.push('/');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Login failed');
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
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white p-6 shadow-md rounded-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLoggedIn ? `Welcome, ${user?.name || 'User'}!` : 'Login'}
        </h2>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        ) : (
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="text"
              placeholder="Phone Number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
              autoComplete="off"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
              autoComplete="new-password"
            />
            <button
              type="submit"
              className={`w-full p-2 rounded-md transition ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}
      </div>
      {!isLoggedIn && (
        <Link href="/forget-password" className="text-blue-500 mt-2 hover:underline">
          Forgot Password?
        </Link>
      )}
      <ToastContainer />
    </div>
  );
};

export default LoginForm;
