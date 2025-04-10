"use client";
import React from "react";
import Link from "next/link";
import { useCompany } from "@/utils/Company";
import { FaTimesCircle } from "react-icons/fa";
import AdminNavs from "./AdminNavs";
import EmployeeNavs from "./EmployeeNavs";

interface sidebarProps {
  isSidebarExpanded: boolean;
  isMobile: boolean;
  openMenu: () => void;
}

const Sidebar: React.FC<sidebarProps> = ({ isSidebarExpanded, isMobile, openMenu }) => {
  const { userType, companySlug } = useCompany();

  const renderNav = () => {
    if (userType === "employee") {
      return <EmployeeNavs openMenu={openMenu} isSidebarExpanded={isSidebarExpanded} isMobile={isMobile} />;
    }
    if (userType === "admin") {
      return <AdminNavs openMenu={openMenu} isSidebarExpanded={isSidebarExpanded} isMobile={isMobile} />;
    }
    return null;
  };

  return (
    <aside>
      <div className="sidebar-header">
        {isMobile ? (
          <>
            <Link href={`/${companySlug}${userType === "employee" ? "/employee/dashboard" : "/"}`} onClick={openMenu}>
              AMT CRM
            </Link>
            <FaTimesCircle
              size={20}
              style={{ cursor: "pointer" }}
              onClick={openMenu}
              className="close-sidebar"
            />
          </>
        ) : isSidebarExpanded ? (
          <Link href={`/${companySlug}${userType === "employee" ? "/employee/dashboard" : "/"}`}>AMT CRM</Link>
        ) : (
          <Link href={`/${companySlug}${userType === "employee" ? "/employee/dashboard" : "/"}`}>A</Link>
        )}
      </div>
      {renderNav()}
    </aside>
  );
};

export default Sidebar;
