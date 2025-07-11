"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/app/superadmin/components/sideBar";
import Header from "@/app/superadmin/components/header";
import FooterBarMenu from "@/app/[slug]/_common/footer/FooterBarMenu";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export const SuperAdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();

  const [isToggle, setIsToggle] = useState<boolean>(false); // mobile sidebar toggle state
  const [isMobile, setIsMobile] = useState<boolean>(false); // check if the device is mobile
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("sidebarState");
      return savedState ? JSON.parse(savedState) : true;
    }
    return true;
  });

  // Detect screen size on mount and when resizing
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024); // Set to true if the screen size is <= 1024px
    };

    // Initialize on mount
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update localStorage whenever the state changes, but only for larger screens
  useEffect(() => {
    if (typeof window !== "undefined" && !isMobile) {
      localStorage.setItem("sidebarState", JSON.stringify(isSidebarExpanded));
    }
  }, [isSidebarExpanded, isMobile]);

  // Toggle left sidebar for desktop
  const handleToggleSidebar = () => {
    setIsSidebarExpanded((prevState: boolean) => !prevState);
  };

  // Toggle sidebar for mobile
  const openMenu = () => {
    setIsToggle(!isToggle);  // Toggle mobile sidebar visibility
  };

  // Close sidebar if click outside in mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobile &&
        isToggle &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsToggle(false);
      }
    };

    if (isToggle && isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isToggle, isMobile]);

  // Render children if on the homepage
  if (pathname === "/") {
    return <>{children}</>;
  }

  return (
    <>
      <div className="main">
        {/* Overlay that appears when mobile menu is open */}
        {isMobile && isToggle && (
          <div
            className="overlay"
            onClick={() => setIsToggle(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.13)",
              zIndex: 9,
              cursor: 'pointer',
            }}
          />
        )}
        <div
          className={`sidebar ${isSidebarExpanded ? 'expanded-view' : 'collapse-view'} ${isMobile ? (isToggle ? 'show-sidebar' : 'hide-sidebar') : ''}`}
          style={{
            width: isMobile ? '90%' : isSidebarExpanded ? '250px' : '60px',
          }}
        >
          <Sidebar
            isSidebarExpanded={isSidebarExpanded}
            isMobile={isMobile}
            openMenu={openMenu}
          />
          {!isMobile && (
            <span onClick={handleToggleSidebar} className="sidebar-toggle-btn">
              {isSidebarExpanded ?
                <FaChevronLeft /> : < FaChevronRight />
              }
            </span>
          )}
        </div>
        <div className="main-content">
          <Header
            openMenu={openMenu}
            isMobile={isMobile}
          />
          <div className="page-content">
            {children}
          </div>
          <FooterBarMenu openMenu={openMenu} />
        </div>
      </div>
    </>
  );
};
