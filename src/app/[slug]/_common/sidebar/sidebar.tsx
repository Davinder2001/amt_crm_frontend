"use client";
import React from "react";
import Link from "next/link";
import { useFetchSelectedCompanyQuery } from "@/slices/auth/authApi";
import {
  FaTachometerAlt, FaStore, FaUserTie, FaUserShield,
  FaCog, FaTasks, FaCar, FaCheck, FaFileInvoice, FaClipboardList, FaBox
} from "react-icons/fa";
import { LuClipboardList } from "react-icons/lu"; // Services Icon

const Sidebar = () => {
  const { data: selectedCompany} = useFetchSelectedCompanyQuery();
  const companySlug = selectedCompany?.selected_company?.company_slug;

  // if (isFetching) return <p className="loading-text">Loading...</p>;
  // if (!companySlug) return <p className="error-text">No company data found</p>;

  const menuItems = [
    { name: "Dashboard", path: "dashboard", icon: <FaTachometerAlt /> },
    { name: "Catalogue", path: "catalogue", icon: <FaClipboardList /> },
    { name: "Store", path: "store", icon: <FaStore /> },
    { name: "Services", path: "services", icon: <LuClipboardList /> },
    { name: "H.R", path: "hr", icon: <FaUserTie /> },
    { name: "Invoices", path: "invoices", icon: <FaFileInvoice />, hasSubmenu: true },
    { name: "Task", path: "tasks", icon: <FaTasks /> },
    { name: "Vehicle", path: "vehicle", icon: <FaCar /> },
    { name: "Quality Control", path: "quality-control", icon: <FaCheck /> },
    { name: "Permissions", path: "permissions", icon: <FaUserShield /> },
    { name: "Orders", path: "orders", icon: <FaBox /> },
    { name: "Settings", path: "settings", icon: <FaCog /> },
  ];

  return (
    <aside>
      <div className="sidebar-header">
        <Link href={'/'}>AMT CRM</Link>
      </div>
      <nav>
        <ul className="menu-list">
          {menuItems.map(({ name, path, icon, hasSubmenu }) => (
            <li key={path} className={`menu-item ${hasSubmenu ? "has-submenu" : ""}`}>
              <Link href={`/${companySlug}/${path}`} className="menu-link">
                <span className="menu-icon">{icon}</span>
                <span className="menu-text">{name}</span>
                {hasSubmenu && <span className="submenu-icon">+</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
