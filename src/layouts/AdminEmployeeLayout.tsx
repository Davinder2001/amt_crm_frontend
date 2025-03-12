"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "@/app/[slug]/_common/sidebar/sidebar";
import Header from "@/app/[slug]/_common/header/header";
import Footer from "@/app/[slug]/_common/footer/footer";

export default function AdminEmployeeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
