"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaUserCircle, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useLogoutMutation } from "@/slices/auth/authApi";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useUser } from "@/provider/UserContext";
import { useCompany } from "@/utils/Company";

const ProfileIcon: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [logout] = useLogoutMutation();
  const router = useRouter();
  const { userType } = useCompany();

  const { setUser } = useUser();

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
        toast.success(response.data.message);
        Cookies.remove("access_token");
        Cookies.remove("user_type");
        Cookies.remove("company_slug");

        setIsAuthenticated(false);
        setUser(null);

        if (userType === 'user') {
          // Redirect to home page
          router.push('/');
        } else {
          // Redirect to login page
          router.push('/login');
        };
        router.refresh();
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const accessToken = Cookies.get("access_token");
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
            color="#009693"
            className="profile-icon"
            onClick={() => setIsOpen(!isOpen)}
          />

          {isOpen && (
            <div className="custom-dropdown">
              <Link
                href={`/superadmin/my-account`}
                onClick={() => setIsOpen(false)}
                className="dropdown-item"
              >
                <FaUser className="dropdown-icon" /> My Account
              </Link>
              <Link
                href={`/superadmin/settings`}
                onClick={() => setIsOpen(false)}
                className="dropdown-item"
              >
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

export default ProfileIcon;
