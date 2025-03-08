"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./[slug]/_common/sidebar/sidebar";
import Header from "./[slug]/_common/header/header";
import Footer from "./[slug]/_common/footer/footer";
import LoginForm from "./[slug]/login/page";
import { useFetchProfileQuery } from "@/slices/auth/authApi";

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
