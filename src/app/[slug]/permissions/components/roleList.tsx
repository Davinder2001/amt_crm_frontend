
"use client";

import React from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetRolesQuery, useDeleteRoleMutation } from "@/slices/roles/rolesApi";
import { useFetchSelectedCompanyQuery } from "@/slices/auth/authApi";
import { FaPlus } from "react-icons/fa";
import ResponsiveTable from "@/components/common/ResponsiveTable"; // ✅ Import ResponsiveTable
import Loader from "@/components/common/Loader";

const RoleList: React.FC = () => {
  const router = useRouter();
  const { data: rolesData, isLoading, error } = useGetRolesQuery(undefined);
  const [deleteRole] = useDeleteRoleMutation();
  const { data: selectedCompany } = useFetchSelectedCompanyQuery();
  const companySlug = selectedCompany?.selected_company?.company_slug;

  const handleDeleteRole = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    try {
      await deleteRole(id).unwrap();
      toast.success("Role deleted successfully");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "data" in err) {
        const error = err as { data: { message: string } };
        toast.error(error?.data?.message || "Error deleting role");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  if (isLoading) return <Loader />;
  if (error) {
    toast.error("Error loading roles");
    return <div>Error loading roles.</div>;
  }

  const columns = [
    { label: "Role Name", key: "name" as keyof Role },
    {
      label: "Permissions",
      render: (role: Role) =>
        role.permissions?.length
          ? role.permissions.map((perm) => perm.name).join(", ")
          : "None",
    },
    { label: "Company ID", key: "company_id" as keyof Role },
    // {
    //   label: "Actions",
    //   render: (role: Role) => (
    //     <div className="permissions-form-actions-icons-outer">
    //       <Link href={`/${companySlug}/permissions/view-role/${role.id}`}>
    //         <span><FaEye color="#222" /></span>
    //       </Link>
    //       <Link href={`/${companySlug}/permissions/edit-role/${role.id}`}>
    //         <span><FaEdit color="#222" /></span>
    //       </Link>
    //       <span onClick={() => handleDeleteRole(role.id)} className="cursor-pointer">
    //         <FaTrash color="#222" />
    //       </span>
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className="permissions-form-outer">
      <div className="navigation-buttons">
        <Link className="navigation-button" href={`/${companySlug}/permissions/add-role`}>
          <FaPlus /> Add Role
        </Link>
      </div>

      <ResponsiveTable
        data={rolesData?.roles || []}
        columns={columns}
        onDelete={(id) => handleDeleteRole(id)}
        onEdit={(id) => router.push(`/${companySlug}/permissions/edit-role/${id}`)}
        onView={(id) => router.push(`/${companySlug}/permissions/view-role/${id}`)}
      />
    </div>
  );
};

export default RoleList;
