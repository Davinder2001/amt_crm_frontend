// "use client";

// import AdminEmployeeLayout from "@/components/adminEmployee/AdminEmployeeLayout";
// import AuthLayout from "@/components/authLayout/AuthLayout";
// import SuperAdminLayout from "@/components/superAdmin/SuperAdminLayout";
// import { useFetchProfileQuery } from "@/slices/auth/authApi";

// const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
//   const { data } = useFetchProfileQuery();

//   const role = data?.user?.user_type;

//   console.log("User Role:", role);

//   return role === 'superadmin' ? (
//     <SuperAdminLayout>{children}</SuperAdminLayout>
//   ) : role === 'admin' || role === 'user' ? (
//     <AdminEmployeeLayout>{children}</AdminEmployeeLayout>
//   ) : (
//     <AuthLayout>{children}</AuthLayout>
//   );
// };

// export default LayoutWrapper;





"use client";

import { useFetchProfileQuery } from "@/slices/auth/authApi";
import layoutMap from "./layoutMap";
import AuthLayout from "@/layouts/AuthLayout";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data } = useFetchProfileQuery();

  const role = data?.user?.user_type;

  console.log("User Role:", role);

  const SelectedLayout = role ? layoutMap[role] || AuthLayout : AuthLayout;

  return <SelectedLayout>{children}</SelectedLayout>;
};

export default LayoutWrapper;
