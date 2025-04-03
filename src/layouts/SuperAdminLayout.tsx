'use client'

import Header from "@/app/superadmin/components/header";
import SideBar from "@/app/superadmin/components/sideBar";
import { usePathname } from "next/navigation";

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

export const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({ children }) => {
  const pathname = usePathname()
  if (pathname === '/') {
    return <>{children}</>
  }
  return (
    <div className="super-admin-layout-wrapper">
      <div className="super-admin-layout-inner">
        <div className="sidebar">
          <SideBar />
        </div>
        <div className="content-area">
          <Header />
          <main className="super-admin-layout">{children}</main>
        </div>
      </div>
    </div>
  );
}