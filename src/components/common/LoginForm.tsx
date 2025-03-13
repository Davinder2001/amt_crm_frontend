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
      // Use type assertion to safely handle the error
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
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-white p-6 shadow-md rounded-md w-96">
          <h2 className="text-2xl font-bold mb-4 text-center">
            {isLoggedIn ? `Welcome, ${user?.name || "User"}!` : "Login"}
          </h2>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Phone Number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full p-2 mb-3 border rounded-md"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mb-3 border rounded-md"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          )}
        </div>
        <Link href='/forget-password'>Forget Password</Link>
      </div>
      <ToastContainer />
    </>
  );
};

export default LoginForm;
