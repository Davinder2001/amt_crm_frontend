'use client'

import { UserFooter, UserNavbar } from "@/components/pages/Homepage";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <>
      <UserNavbar />
      <main className="auth-layout">{children}</main>
      <UserFooter />
    </>
  );
}

export default AuthLayout