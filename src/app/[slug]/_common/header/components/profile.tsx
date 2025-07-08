"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaUser, FaSignOutAlt, FaChevronDown, FaFileInvoiceDollar } from "react-icons/fa";
import { useLogoutMutation } from "@/slices/auth/authApi";
import { useRouter } from 'next/navigation'
import { toast } from "react-toastify";
import { useUser } from "@/provider/UserContext";
import { clearStorage, useCompany } from "@/utils/Company";
import ThemeSwitcher from "./ThemeSwitcher";
import { setTheme } from '@/slices/theme/themeSlice';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store/store';
import Loader from "@/components/common/Loader";


const Profile: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch<AppDispatch>();
  const { user, setUser } = useUser();
  const { companySlug, userType, accessToken } = useCompany();
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    try {
      const response = await logout();

      if (response?.data?.message) {
        toast.success(response?.data?.message);
        clearStorage();
        setIsAuthenticated(false);
        dispatch(setTheme('light'));

        if (userType === 'user') {
          router.push('/');
        } else {
          router.push('/login');
        }
        router.refresh();
      } else {
        toast.error(response?.data?.message)
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!accessToken || !userType) {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [setUser, accessToken, userType]);

  return (
    <div className="profile-container" ref={dropdownRef}>

      <div className={`profile-dropdown ${isOpen ? 'open' : ''}`}>
        {isOpen && (
          <div
            className="profile-overlay"
            onClick={() => setIsOpen(false)}
          />
        )}
        <button
          className="profile-trigger"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="User profile menu"
        >
          <div className="profile-avatar">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="profile-name">
            {user?.name?.split(' ')[0] || 'User'}
          </div>
          <FaChevronDown className={`dropdown-icon ${isOpen ? 'open' : ''}`} />
        </button>
        {isAuthenticated ? (
          <>
            {isOpen && (
              <div className="profile-menu">
                <div className="menu-header">
                  <div className="menu-avatar">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="menu-user-info">
                    <div className="menu-username">{user?.name || 'User'}</div>
                    <div className="menu-email">{user?.email || ''}</div>
                  </div>
                </div>

                <nav className="menu-items">
                  <Link
                    href={`${basePath}/my-account`}
                    onClick={() => setIsOpen(false)}
                    className="menu-item"
                  >
                    <FaUser className="menu-icon" />
                    <span>My Account</span>
                  </Link>
                  <Link
                    href={`${basePath}/my-account/billings`}
                    onClick={() => setIsOpen(false)}
                    className="menu-item"
                  >
                    <FaFileInvoiceDollar className="menu-icon" />
                    <span>Billing</span>
                  </Link>
                  <ThemeSwitcher />

                  <button
                    className="menu-item logout"
                    onClick={handleLogout}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader />
                    ) : (
                      <>
                        <FaSignOutAlt className="menu-icon" />
                        <span>Logout</span>
                      </>
                    )}
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default Profile;