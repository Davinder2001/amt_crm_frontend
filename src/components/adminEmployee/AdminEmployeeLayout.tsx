"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../app/[slug]/_common/sidebar/sidebar";
import Header from "../../app/[slug]/_common/header/header";
import Footer from "../../app/[slug]/_common/footer/footer";
import { useFetchProfileQuery } from "@/slices/auth/authApi";
import LoginForm from "../common/LoginForm";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { data: profile } = useFetchProfileQuery();

  useEffect(() => {
    if (profile?.user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [profile]);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="main">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="main-content">
        <Header />
        {children}
        <Footer />
      </div>
      <ToastContainer autoClose={2000} />
    </div>
  );
}









// "use client";

// import React, { useState, useEffect } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Sidebar from "../../app/[slug]/_common/sidebar/sidebar";
// import Header from "../../app/[slug]/_common/header/header";
// import Footer from "../../app/[slug]/_common/footer/footer";
// import { adminEmployeeRoutes } from "@/routes";

// export default function AdminEmployeeLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const pathname = usePathname()
//   const isAdminEmployeeRoutes = adminEmployeeRoutes(pathname).some((route) => pathname.startsWith(route))

//   if (isAdminEmployeeRoutes) {
//     return (
//       <div className="main">
//         <div className="sidebar">
//           <Sidebar />
//         </div>
//         <div className="main-content">
//           <Header />
//           {children}
//           <Footer />
//         </div>
//         <ToastContainer autoClose={2000} />
//       </div>
//     );
//   }
// }
