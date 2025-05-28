"use client";
import React from "react";
import Link from "next/link";
import { FaTachometerAlt, FaBuilding, FaUserTie, FaCogs, FaTimesCircle, FaCube } from "react-icons/fa";
import Image from "next/image";
import { logo } from "@/assets/useImage";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isSidebarExpanded: boolean;
  isMobile: boolean;
  openMenu: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarExpanded, isMobile, openMenu }) => {
  const asPath = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "dashboard", icon: <FaTachometerAlt /> },
    { name: "Business Users", path: "admins", icon: <FaUserTie /> },
    { name: "Companies", path: "companies", icon: <FaBuilding /> },
    { name: "Packages", path: "packages", icon: <FaCube /> },
    { name: "Settings", path: "settings", icon: <FaCogs /> },
  ];

  return (
    <aside>
      <div className="sidebar-header">
        {isMobile ? (
          <>
            <Link href="/superadmin/dashboard" className="logo-wrapper" onClick={openMenu}>
              <Image src={logo.src} alt="logo" width={50} height={50} />
              <span>AMT CRM</span>
            </Link>
            <FaTimesCircle
              size={20}
              style={{ cursor: "pointer" }}
              onClick={openMenu}
              className="close-sidebar"
            />
          </>
        ) : isSidebarExpanded ? (
          <Link href="/superadmin/dashboard" className="logo-wrapper">
            <Image src={logo.src} alt="logo" width={50} height={50} />
            <span>AMT CRM</span>
          </Link>
        ) : (
          <Link href="/superadmin/dashboard" className="logo-wrapper">
            <Image src={logo.src} alt="logo" width={30} height={30} />
          </Link>
        )}
      </div>

      <nav>
        <ul className="menu-list">
          {menuItems.map(({ name, path, icon }) => {
            const fullPath = `/superadmin/${path}`;
            const isActive = asPath === fullPath || asPath.startsWith(`${fullPath}/`);

            return (
              <li
                key={path}
                className={`menu-item  ${isActive ? "active" : ""}`}
                style={{ backgroundColor: isActive ? "#F1F9F9" : "" }}
                onClick={openMenu}
              >
                <Link href={fullPath} className="menu-link">
                  <span className="menu-icon">
                    {icon}
                  </span>
                  {isSidebarExpanded && <span className="menu-text">{name}</span>}
                </Link>
                {!isSidebarExpanded && <div className="tooltip">{name}</div>}
                {isActive && (
                  <span className="active-indicator" />
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
