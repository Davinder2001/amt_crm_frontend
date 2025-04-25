'use client'
import React, { useEffect } from "react";
import ChangePassword from "./components/changePassword";
import { useBreadcrumb } from "@/provider/BreadcrumbContext";
import Profile from "./components/profile";

const Page = () => {

  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('My Profile');
  }, [setTitle]);



  return (
    <>
      <Profile />
      <ChangePassword />
    </>








  );
};

export default Page;
