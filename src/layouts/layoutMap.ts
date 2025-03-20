import AdminEmployeeLayout from "@/layouts/AdminEmployeeLayout";
import SuperAdminLayout from "@/layouts/SuperAdminLayout";

const layoutMap: Record<string, React.ComponentType<{ children: React.ReactNode }>> = {
  superadmin: SuperAdminLayout,
  admin: AdminEmployeeLayout,
  employee: AdminEmployeeLayout,
};

export default layoutMap;
