'use client'

import { superAdminRoutes } from "@/routes";
import { usePathname } from "next/navigation";

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({ children }) => {
  const pathname = usePathname()
  const isSuperAdminRoutes = superAdminRoutes.some((route) => pathname.startsWith(route))

  if (isSuperAdminRoutes) {
    return (
      <>
        <main className="super-admin-layout">{children}</main>
      </>
    );
  }
}

export default SuperAdminLayout