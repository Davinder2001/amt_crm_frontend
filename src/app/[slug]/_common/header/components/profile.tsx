"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaUserCircle, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useLogoutMutation } from "@/slices/auth/authApi";
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation'
import { toast } from "react-toastify";
import { useUser } from "@/provider/UserContext";
import { useCompany } from "@/utils/Company";


const Profile: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const [logout] = useLogoutMutation();

  const { setUser } = useUser();
  const { companySlug, userType } = useCompany();

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
        Cookies.set('user_type', 'user');
        Cookies.remove('company_slug');

        setIsAuthenticated(false);

        if (userType === 'user') {
          // Redirect to login page
          router.push('/');
        } else {
          // Redirect to login page
          router.push('/login');
        }
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
    const userType = Cookies.get('user_type') ?? 'user';
    if (!accessToken || !userType) {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [setUser]);


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
            // <div className="dropdown-content">
            //   <Link href={`/${companySlug}/my-account`} onClick={() => setIsOpen(false)}>
            //     <FaUser className="icon" /> My Account
            //   </Link>
            //   <Link href={`/${companySlug}/settings`} onClick={() => setIsOpen(false)}>
            //     <FaCog className="icon" /> Settings
            //   </Link>
            //   <button className="logout-btn" onClick={handleLogout}>
            //     <FaSignOutAlt className="icon" /> Logout
            //   </button>
            // </div>


            <div className="custom-dropdown">
              <Link href={`/${companySlug}${userType === 'employee' ? '/employee' : ''}/my-account`} onClick={() => setIsOpen(false)} className="dropdown-item">
                <FaUser className="dropdown-icon" /> My Account
              </Link>
              <Link href={`/${companySlug}${userType === 'employee' ? '/employee' : ''}/settings`} onClick={() => setIsOpen(false)} className="dropdown-item">
                <FaCog className="dropdown-icon" /> Settings
              </Link>
              <button className="dropdown-item logout-btn" onClick={handleLogout}>
                <FaSignOutAlt className="dropdown-icon" /> Logout
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
