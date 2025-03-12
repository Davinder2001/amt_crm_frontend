'use client'

import { authRoutes } from "@/routes";
import { usePathname } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const pathname = usePathname()
  const isAuthRoutes = authRoutes.some((route) => pathname.startsWith(route))

  if (isAuthRoutes) {

    return (
      <>
        <main className="auth-layout">{children}</main>
      </>
    );
  }
}

export default AuthLayout