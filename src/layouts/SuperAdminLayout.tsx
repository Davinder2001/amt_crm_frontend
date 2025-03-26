'use client'

import Header from "@/app/superadmin/components/header";
import SideBar from "@/app/superadmin/components/sideBar";

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

export const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({ children }) => {
    return (
      <div className="super-admin-layout-wrapper">
        <div className="side-bar">
          <SideBar/>
        </div>
        <Header/>
        <main className="super-admin-layout">{children}</main>
      </div>
    );
}