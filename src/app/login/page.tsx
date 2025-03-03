"use client";
import React, { useState, useEffect } from "react";
import { useLoginMutation, useFetchProfileQuery } from "@/slices/auth/authApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);

  // We remove the skip so the profile is fetched on mount.
  const { data: profile, isFetching } = useFetchProfileQuery();
  const [login, { isLoading }] = useLoginMutation();

  // When the profile query returns, update user state.
  useEffect(() => {
    if (profile && profile.profile) {
      setUser(profile.profile[0]);
    } else {
      setUser(null);
    }
  }, [profile]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // On login, Sanctum sets the session cookie.
      const result = await login({ email, password }).unwrap();

      console.log('result', result)
      // Set the access token as a cookie.
      toast.success("Login successful");
      document.cookie = `access_token=${result.access_token}; path=/;`;
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Login failed";
      toast.error(errorMessage);
    }
  };

  const handleLogout = () => {
    // You may call a logout endpoint if needed.
    setUser(null);
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
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
      </div>
    </>
  );
};

export default Page;
