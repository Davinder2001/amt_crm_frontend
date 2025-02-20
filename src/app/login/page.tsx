"use client";
import React, { useState } from "react";
import { useLoginMutation } from "@/slices/users/userApi";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login] = useLoginMutation();

  const handleLogin = async () => {
    let resp = await login({ email, password });


    let getToken = resp?.data?.token;
    let getUser = resp?.data?.user;

    if (getToken) {
      localStorage.setItem("authToken", getToken);
      localStorage.setItem("user", JSON.stringify(getUser));
      alert("Login successful");
    } else {
      alert("Login failed");
    }

    return resp;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white p-6 shadow-md rounded-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
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
      </div>
    </div>
  );
};

export default Page;
