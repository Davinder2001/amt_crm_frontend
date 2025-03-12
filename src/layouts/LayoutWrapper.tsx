"use client";

import { useFetchProfileQuery } from "@/slices/auth/authApi";
import layoutMap from "./layoutMap";
import AuthLayout from "@/layouts/AuthLayout";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data } = useFetchProfileQuery();
  const role = data?.user?.user_type;
  const SelectedLayout = role ? layoutMap[role] || AuthLayout : AuthLayout;

  return <SelectedLayout>{children}</SelectedLayout>;
};

export default LayoutWrapper;
