"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaUserCircle, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa"; // Importing Icons
import { useLogoutMutation } from "@/slices/auth/authApi"; // Assuming the API slice is correct
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation'
import { toast } from "react-toastify";
import { useCompany } from "@/utils/Company";

const Profile: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const [logout] = useLogoutMutation();

  const {companySlug} = useCompany();

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

  const handleLogout = async () => {
    try {
      // Attempt to log out
      const response = await logout();

      // Check if the logout response indicates success (assuming `logout` returns a success message or status)
      if (response?.data?.message) {
        toast.success(response?.data?.message);
        // Only remove cookies if logout was successful
        Cookies.remove('access_token');
        Cookies.remove('user_type');
        Cookies.remove('company_slug');

        // Update authentication state
        setIsAuthenticated(false);

        // Redirect to login page
        router.push('/login');
        router.refresh();
      } else {
        // Handle logout failure (you can also display a message or alert if necessary)
        toast.error(response?.data?.message)
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Automatically update UI based on cookies (after logout)
  useEffect(() => {
    const accessToken = Cookies.get('access_token');
    const userType = Cookies.get('user_type');
    if (!accessToken || !userType) {
      setIsAuthenticated(false); // Ensure context is cleared if cookies are missing
    }
  }, []);

  // Handle loading state or missing companySlug
  // if (isFetching) return <p>Loading...</p>;
  // if (!companySlug) return <p>No company data found</p>;

  return (
    <div className="account">
      {isAuthenticated ? (
        <div className="dropdown">
          {/* Profile Icon as Dropdown Trigger */}
          <FaUserCircle
            size={30}
            color='#009693'
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
