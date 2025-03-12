"use client";
import React from "react";
import Link from "next/link";
import { useFetchProfileQuery } from "@/slices/auth/authApi";
import { FaTachometerAlt, FaStore, FaUserTie, FaUserShield, FaCog, FaTasks } from "react-icons/fa";

const Sidebar = () => {
  const { companySlug, isFetching } = useFetchProfileQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      companySlug: data?.user?.company_slug,
      isFetching,
    }),
  });

  if (isFetching) return <p className="loading-text">Loading...</p>;
  if (!companySlug) return <p className="error-text">No company data found</p>;

  const menuItems = [
    { name: "Dashboard", path: "dashboard", icon: <FaTachometerAlt /> },
    { name: "Store", path: "store", icon: <FaStore /> },
    { name: "HR", path: "hr", icon: <FaUserTie /> },
    { name: "Permissions", path: "permissions", icon: <FaUserShield /> },
    { name: "Settings", path: "settings", icon: <FaCog /> },
    { name: "Task", path: "tasks", icon: <FaTasks /> },
  ];

  return (
    <aside className="sidebar">
      <nav>
        <ul className="menu-list">
          {menuItems.map(({ name, path, icon }) => (
            <li key={path} className="menu-item">
              <Link href={`/${companySlug}/${path}`} className="menu-link">
                <span className="menu-icon">{icon}</span>
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
