"use client";
import React, { useState, useEffect } from "react";
import { useLoginMutation } from "@/slices/users/userApi";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [login] = useLoginMutation();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async () => {
    let resp = await login({ email, password });

    let getToken = resp?.data?.token;
    let getUser = resp?.data?.user;

    if (getToken) {
      localStorage.setItem("authToken", getToken);
      localStorage.setItem("user", JSON.stringify(getUser));
      setIsLoggedIn(true);
      alert("Login successful");
    } else {
      alert("Login failed");
    }

    return resp;
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    alert("Logged out successfully!");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white p-6 shadow-md rounded-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLoggedIn ? "Welcome!" : "Login"}
        </h2>

        {!isLoggedIn ? (
          <>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-3 border rounded-md"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-3 border rounded-md"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
            >
              Login
            </button>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Page;
