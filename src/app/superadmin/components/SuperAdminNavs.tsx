"use client";
import React from "react";
import { FaTachometerAlt, FaUserShield, FaUsers, FaBuilding, FaCog } from "react-icons/fa";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface superAdminNavProps {
  isSidebarExpanded: boolean;
  isMobile: boolean;
  openMenu: () => void;
}

const SuperAdminNavs: React.FC<superAdminNavProps> = ({ isSidebarExpanded, openMenu }) => {
  const asPath = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "superadmin/dashboard", icon: <FaTachometerAlt /> },
    { name: "Companies", path: "superadmin/companies", icon: <FaBuilding /> },
    { name: "Users", path: "superadmin/users", icon: <FaUsers /> },
    { name: "Permissions", path: "superadmin/permissions", icon: <FaUserShield /> },
    { name: "Settings", path: "superadmin/settings", icon: <FaCog /> },
  ];

  return (
    <nav>
      <ul className="menu-list">
        {menuItems.map(({ name, path, icon }) => {
          const isActive = asPath === `/${path}` || asPath.startsWith(`/${path}/`);
          return (
            <li
              key={path}
              className="menu-item"
              style={{ backgroundColor: isActive ? "#F1F9F9" : "", position: "relative" }}
              onClick={openMenu}
            >
              <Link href={`/${path}`} className="menu-link">
                <span className="menu-icon" style={{ color: isActive ? "#009693" : "#222" }}>
                  {icon}
                </span>
                <span className="menu-text">{name}</span>
              </Link>
              {!isSidebarExpanded && (
                <div className="tooltip">{name}</div>
              )}
              {isActive && (
                <span
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "3px",
                    height: "100%",
                    backgroundColor: "#009693",
                    borderRadius: "2px",
                  }}
                />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SuperAdminNavs;
