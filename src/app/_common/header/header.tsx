"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useLogoutMutation } from "@/slices/auth/authApi"; // adjust the path as needed

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logout] = useLogoutMutation();

  useEffect(() => {
    // Parse cookies and check for the "access_token" cookie.
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split("=");
      acc[name] = value;
      return acc;
    }, {});
    setIsAuthenticated(!!cookies.access_token);
  }, []);

  const handleLogout = async () => {
    try {
      // First, hit the logout API.
      const response = await logout().unwrap();

      // If successful, remove the "access_token" cookie.
      document.cookie =
        "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setIsAuthenticated(false);
      alert("✅ Logged out successfully!");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-between p-4 bg-gray-100 shadow-md">
      <div>
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
