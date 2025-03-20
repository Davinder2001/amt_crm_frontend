"use client";
import React from "react";
import Link from "next/link";
import { useFetchSelectedCompanyQuery } from "@/slices/auth/authApi";
import { FaTachometerAlt, FaStore, FaUserTie, FaUserShield, FaCog, FaTasks, FaCar, FaCheck } from "react-icons/fa";

const Sidebar = () => {
  const { data: selectedCompany, isFetching } = useFetchSelectedCompanyQuery();

  // Extract companySlug from selectedCompany
  const companySlug = selectedCompany?.selected_company?.company_slug;

  if (isFetching) return <p className="loading-text">Loading...</p>;
  if (!companySlug) return <p className="error-text">No company data found</p>;

  const menuItems = [
    { name: "Dashboard", path: "dashboard", icon: <FaTachometerAlt /> },
    { name: "Store", path: "store", icon: <FaStore /> },
    { name: "HR", path: "hr", icon: <FaUserTie /> },
    { name: "Task", path: "tasks", icon: <FaTasks /> },
    { name: "Vehicle", path: "vehicle", icon: <FaCar /> },
    { name: "Quality Control", path: "quality-control", icon: <FaCheck /> },
    { name: "Permissions", path: "permissions", icon: <FaUserShield /> },
    { name: "Settings", path: "settings", icon: <FaCog /> },
  ];

  return (
    <aside className="sidebar-inner">
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
