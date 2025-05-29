"use client";
import React from "react";
import Link from "next/link";
import { useCompany } from "@/utils/Company";
import { FaTimesCircle } from "react-icons/fa";
import AdminNavs from "./AdminNavs";
import EmployeeNavs from "./EmployeeNavs";
import Image from "next/image";
import { logo } from "@/assets/useImage";

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
            <Link href={`${userType === 'employee'
              ? `/${companySlug}/employee/dashboard`
              : `/${companySlug}/dashboard`}`} className="logo-wrapper" onClick={openMenu}><Image src={logo.src} alt="logo" width={30} height={30} /> <span>AMT CRM</span></Link>
            <FaTimesCircle
              size={20}
              style={{ cursor: "pointer" }}
              onClick={openMenu}
              className="close-sidebar"
            />
          </>
        ) : isSidebarExpanded ? (
          <Link href={`${userType === 'employee'
            ? `/${companySlug}/employee/dashboard`
            : `/${companySlug}/dashboard`}`} className="logo-wrapper"><Image src={logo.src} alt="logo" width={30} height={30} /> <span>AMT CRM</span></Link>
        ) : (
          <Link href={`${userType === 'employee'
            ? `/${companySlug}/employee/dashboard`
            : `/${companySlug}/dashboard`}`} className="logo-wrapper"><Image src={logo.src} alt="logo" width={30} height={30} /></Link>
        )}
      </div>
      {renderNav()}
    </aside>
  );
};

export default Sidebar;
