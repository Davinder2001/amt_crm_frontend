"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaUserCircle, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa"; // Importing Icons

const Profile: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const cookies = document.cookie
      .split(";")
      .reduce((acc: Record<string, string>, cookie) => {
        const [name, value] = cookie.trim().split("=");
        acc[name] = decodeURIComponent(value);
        return acc;
      }, {});

    setIsAuthenticated(!!cookies.access_token);
  }, []);

  const handleLogout = () => {
    document.cookie =
      "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsAuthenticated(false);
    toast.success("✅ Logged out successfully!");
  };

  return (
    <div className="account">
      {isAuthenticated ? (
        <div className="dropdown">
          {/* Profile Icon as Dropdown Trigger */}
          <FaUserCircle
            size={35}
            className="profile-icon"
            onClick={() => setIsOpen(!isOpen)}
          />

          {isOpen && (
            <div className="dropdown-content">
              <Link href="/profile" onClick={() => setIsOpen(false)}>
                <FaUser className="icon" /> Profile
              </Link>
              <Link href="/settings" onClick={() => setIsOpen(false)}>
                <FaCog className="icon" /> Settings
              </Link>
              <button className="logout-btn" onClick={handleLogout}>
                <FaSignOutAlt className="icon" /> Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link href="/login" className="login-btn">
          Login
        </Link>
      )}
    </div>
  );
};

export default Profile;
