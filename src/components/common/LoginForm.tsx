"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation, useFetchProfileQuery } from "@/slices/auth/authApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

interface UserProfile {
  id: number;
  name: string;
  number: string;
  company_id: number;
  company_name: string;
  company_slug: string;
  user_type: string;
}

const LoginForm = () => {
  const router = useRouter();
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<UserProfile | null>(null);

  // Fetch authenticated user profile
  const { data: profile } = useFetchProfileQuery();
  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (profile?.user) {
      setUser(profile.user);
    }
  }, [profile]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ number, password }).unwrap();
      toast.success("Login successful");

      // Store session token, user type, and company slug
      document.cookie = `access_token=${result.access_token}; path=/;`;
      document.cookie = `user_type=${result.user.user_type}; path=/;`;
      document.cookie = `company_slug=${result.user.company_slug}; path=/;`;

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
    setUser(null);
    router.push("/");
    toast.success("Logged out successfully!");
  };

  const isLoggedIn = !!user;

  return (
    <div className="company-login-page">
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
