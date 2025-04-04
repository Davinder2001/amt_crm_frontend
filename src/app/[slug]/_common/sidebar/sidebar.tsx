"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaTachometerAlt, FaStore, FaUserTie, FaUserShield,
  FaCog, FaTasks, FaCar, FaCheck, FaFileInvoice, FaClipboardList, FaBox
} from "react-icons/fa";
import { LuClipboardList } from "react-icons/lu"; // Services Icon
import { useCompany } from "@/utils/Company";
const Sidebar = () => {

  const {companySlug} = useCompany();

  // Using useRouter to get the current route
  const asPath = usePathname();

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
          {menuItems.map(({ name, path, icon, hasSubmenu }) => {
            // Check if the current path matches the route
            const isActive = asPath.includes(path);

            return (
              <li
                key={path}
                className={`menu-item ${hasSubmenu ? "has-submenu" : ""}`}
                style={{
                  backgroundColor: isActive ? "#F1F9F9" : "",
                  position: "relative",
                }}
              >
                <Link href={`/${companySlug}/${path}`} className="menu-link">
                  <span className="menu-icon"
                    style={{
                      color: isActive ? "#009693" : "#222",
                    }}>{icon}</span>
                  <span className="menu-text">{name}</span>
                  {hasSubmenu && <span className="submenu-icon">+</span>}
                </Link>
                {isActive && (
                  <span
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "3px",
                      height: "100%",
                      backgroundColor: "#009693",
                      borderRadius: '2px'
                    }}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
