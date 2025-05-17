'use client'
import React, { useEffect } from "react";
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
    </>
  );
};

export default Page;
