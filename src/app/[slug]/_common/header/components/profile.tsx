"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaUserCircle, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useFetchSelectedCompanyQuery, useLogoutMutation } from "@/slices/auth/authApi";
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation'
import { toast } from "react-toastify";


const Profile: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const [logout] = useLogoutMutation();

  const { data: selectedCompany } = useFetchSelectedCompanyQuery();
  const companySlug = selectedCompany?.selected_company?.company_slug;

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
      const response = await logout();

      if (response?.data?.message) {
        toast.success(response?.data?.message);
        Cookies.remove('access_token');
        Cookies.remove('user_type');
        Cookies.remove('company_slug');

        setIsAuthenticated(false);

        router.push('/login');
        router.refresh();
      } else {
        toast.error(response?.data?.message)
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    const accessToken = Cookies.get('access_token');
    const userType = Cookies.get('user_type');
    if (!accessToken || !userType) {
      setIsAuthenticated(false);
      router.push('/login');
    }
    router.refresh(); // Refresh the page to ensure the context is updated
  }, []);


  return (
    <div className="account">
      {isAuthenticated ? (
        <div className="dropdown">

          <FaUserCircle
            size={30}
            color='#009693'
            className="profile-icon"
            onClick={() => setIsOpen(!isOpen)}
          />

          {isOpen && (
            <div className="dropdown-content">
              <Link href={`/${companySlug}/my-account`} onClick={() => setIsOpen(false)}>
                <FaUser className="icon" /> My Account
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
