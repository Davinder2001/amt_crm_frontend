"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaUserCircle, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useLogoutMutation } from "@/slices/auth/authApi";
import { useRouter } from 'next/navigation'
import { toast } from "react-toastify";
import { useUser } from "@/provider/UserContext";
import { clearStorage, useCompany } from "@/utils/Company";


const Profile: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [logout] = useLogoutMutation();

  const { setUser } = useUser();
  const { companySlug, userType, accessToken } = useCompany();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const basePath =
    userType === "employee"
      ? `/${companySlug}/employee`
      : userType === "super-admin"
        ? `/superadmin`
        : `/${companySlug}`;


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
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  const handleLogout = async () => {
    try {
      const response = await logout();

      if (response?.data?.message) {
        toast.success(response?.data?.message);

        clearStorage();

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
    if (!accessToken || !userType) {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [setUser, accessToken, userType]);


  return (
    <div className="account" ref={dropdownRef}>
      {isAuthenticated ? (
        <div className="dropdown">

          <FaUserCircle
            size={30}
            color='#009693'
            className="profile-icon"
            onClick={() => setIsOpen(!isOpen)}
          />

          {isOpen && (
            <div className="custom-dropdown">
              <Link
                href={`${basePath}/my-account`}
                onClick={() => setIsOpen(false)}
                className="dropdown-item"
              >
                <FaUser className="dropdown-icon" /> My Account
              </Link>
              <Link
                href={`${basePath}/settings`}
                onClick={() => setIsOpen(false)}
                className="dropdown-item"
              >
                <FaCog className="dropdown-icon" /> Settings
              </Link>
              <button
                className="dropdown-item logout-btn"
                onClick={handleLogout}
              >
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
