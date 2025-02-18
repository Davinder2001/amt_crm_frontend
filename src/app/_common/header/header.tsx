"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    alert("✅ Logged out successfully!");
  };

  return (
    <div className="flex justify-between p-4 bg-gray-100 shadow-md">
      <h1 className="text-xl font-bold">My App</h1>
      
      <div>
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <Link href="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
