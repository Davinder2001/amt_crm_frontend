"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/[slug]/_common/sidebar/sidebar";
import Header from "@/app/[slug]/_common/header/header";
import Footer from "@/app/[slug]/_common/footer/footer";
import { usePathname } from "next/navigation";

export const AdminEmployeeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();

  // Initialize state with value from localStorage if available, default to 'true' (expanded)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("sidebarState");
      return savedState ? JSON.parse(savedState) : true; // Default to true if no value is found
    }
    return true;
  });

  // Update localStorage whenever the state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarState", JSON.stringify(isSidebarExpanded));
    }
  }, [isSidebarExpanded]);

  const handleToggleSidebar = () => {
    setIsSidebarExpanded((prevState: boolean) => !prevState); // Toggle the sidebar state
  };

  if (pathname === "/") {
    return <>{children} </>;
  }

  return (
    <div className="main">
      <div
        className={`sidebar ${isSidebarExpanded ? 'show-sidebar' : 'hide-sidebar'}`}
        style={{
          width: isSidebarExpanded ? '250px' : '60px', // Conditionally set width
        }}
      >
        <Sidebar isSidebarExpanded={isSidebarExpanded} />
      </div>
      <div className="main-content">
        <Header
          handleToggleSidebar={handleToggleSidebar}
        />
        {children}
        <Footer />
      </div>
    </div>
  );
};
