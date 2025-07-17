"use client";
import React from "react";
import Link from "next/link";
import { useCompany } from "@/utils/Company";
import { FaTimesCircle } from "react-icons/fa";
import AdminNavs from "./AdminNavs";
import EmployeeNavs from "./EmployeeNavs";
import Image from "next/image";
import { logo } from "@/assets/useImage";
import { useFetchSelectedCompanyQuery } from "@/slices";

interface sidebarProps {
  isSidebarExpanded: boolean;
  isMobile: boolean;
  openMenu: () => void;
}

const Sidebar: React.FC<sidebarProps> = ({ isSidebarExpanded, isMobile, openMenu }) => {
  const { userType, companySlug } = useCompany();
  const { data, isLoading } = useFetchSelectedCompanyQuery();
  const company = data?.selected_company;

  const renderNav = () => {
    if (userType === "employee") {
      return <EmployeeNavs openMenu={openMenu} isSidebarExpanded={isSidebarExpanded} isMobile={isMobile} />;
    }
    if (userType === "admin") {
      return <AdminNavs openMenu={openMenu} isSidebarExpanded={isSidebarExpanded} isMobile={isMobile} />;
    }
    return null;
  };

  const renderLogo = (size: number) => {
    if (isLoading) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: size,
            height: size,
            backgroundColor: '#e0e0e0',
            borderRadius: '4px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Shimmer effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
              animation: 'shimmer 1.5s infinite',
              transform: 'translateX(-100%)'
            }} />
          </div>
          {isSidebarExpanded && (
            <div style={{
              width: '80px',
              height: '16px',
              backgroundColor: '#e0e0e0',
              borderRadius: '4px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                animation: 'shimmer 1.5s infinite',
                transform: 'translateX(-100%)'
              }} />
            </div>
          )}
          <style jsx>{`
          @keyframes shimmer {
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
        </div>
      );
    }

    const logoUrl = company?.company_logo ?? null;

    return (
      <>
        <Image
          src={logoUrl || logo.src}
          alt={logoUrl ? "company logo" : "default logo"}
          width={size}
          height={size}
        />
        {isSidebarExpanded && !logoUrl && <span>AMT CRM</span>}
      </>
    );
  };

  const dashboardLink = userType === 'employee'
    ? `/${companySlug}/employee/dashboard`
    : `/${companySlug}/dashboard`;

  return (
    <aside>
      <div className="sidebar-header">
        {isMobile ? (
          <>
            <Link href={dashboardLink} className="logo-wrapper" onClick={openMenu}>
              {renderLogo(30)}
            </Link>
            <FaTimesCircle
              size={20}
              style={{ cursor: "pointer" }}
              onClick={openMenu}
              className="close-sidebar"
            />
          </>
        ) : (
          <Link href={dashboardLink} className="logo-wrapper">
            {renderLogo(isSidebarExpanded ? 40 : 30)}
          </Link>
        )}
      </div>
      {renderNav()}
    </aside>
  );
};

export default Sidebar;