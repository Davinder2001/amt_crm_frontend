"use client";
import React from "react";
import Link from "next/link";
import { FaTachometerAlt, FaBuilding, FaUserTie, FaCogs, FaTimesCircle, FaCube, FaListAlt } from "react-icons/fa";
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
    { name: "packages", path: "packages", icon: <FaCube /> },
    { name: "Business Categories", path: "business-categories", icon: <FaListAlt /> },
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
                className="menu-item"
                style={{ backgroundColor: isActive ? "#F1F9F9" : "", position: "relative" }}
                onClick={openMenu}
              >
                <Link href={fullPath} className="menu-link">
                  <span className="menu-icon" style={{ color: isActive ? "#009693" : "#222" }}>
                    {icon}
                  </span>
                  {isSidebarExpanded && <span className="menu-text">{name}</span>}
                </Link>
                {!isSidebarExpanded && <div className="tooltip">{name}</div>}
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
    </aside>
  );
};

export default Sidebar;
