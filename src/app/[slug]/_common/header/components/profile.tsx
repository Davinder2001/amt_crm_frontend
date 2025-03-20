"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { FaUserCircle, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa"; // Importing Icons
import { useFetchSelectedCompanyQuery } from "@/slices/auth/authApi"; // Assuming the API slice is correct

const Profile: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Fetch company slug
  const { data: selectedCompany, isFetching } = useFetchSelectedCompanyQuery();
  // Extract companySlug from selectedCompany
  const companySlug = selectedCompany?.selected_company?.company_slug;
  
  // Handle authentication and cookie check
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

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

  // Handle loading state or missing companySlug
  if (isFetching) return <p>Loading...</p>;
  if (!companySlug) return <p>No company data found</p>;

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
              <Link href={`/${companySlug}/profile`} onClick={() => setIsOpen(false)}>
                <FaUser className="icon" /> Profile
              </Link>
              <Link href={`/${companySlug}/settings`} onClick={() => setIsOpen(false)}>
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
