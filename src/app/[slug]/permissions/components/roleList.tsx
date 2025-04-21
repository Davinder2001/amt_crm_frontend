'use client';

import React from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { useGetRolesQuery, useDeleteRoleMutation } from "@/slices/roles/rolesApi";
import { useFetchSelectedCompanyQuery } from "@/slices/auth/authApi";
import { FaEdit, FaPlus, FaTrash, FaEye } from "react-icons/fa"; // ⬅️ Added FaEye

const RoleList: React.FC = () => {
  const { data: rolesData, isLoading, error } = useGetRolesQuery(undefined);
  const [deleteRole] = useDeleteRoleMutation();
  const { data: selectedCompany } = useFetchSelectedCompanyQuery();
  const companySlug = selectedCompany?.selected_company?.company_slug;

  const handleDeleteRole = async (id: number) => {
    try {
      await deleteRole(id).unwrap();
      toast.success("Role deleted successfully");
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'data' in err) {
        const error = err as { data: { message: string } };
        toast.error(error?.data?.message || "Error deleting role");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  if (isLoading) return <div>Loading roles...</div>;
  if (error) {
    toast.error("Error loading roles");
    return <div>Error loading roles.</div>;
  }

  return (
    <div className="permissions-form-outer">
      <div className="navigation-buttons">
        <Link className="navigation-button" href={`/${companySlug}/permissions/add-role`}>
          <FaPlus /> Add Role
        </Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>Role Name</th>
            <th>Permissions</th>
            <th>Company ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rolesData && rolesData.total > 0 ? (
            rolesData?.roles.map((role: Role) => (
              <tr key={role.id}>
                <td>{role.name}</td>
                <td>
                  {role.permissions
                    ? role.permissions.map((perm) => perm.name).join(", ")
                    : "None"}
                </td>
                <td>{role.company_id}</td>
                <td className="permissions-form-actions-icons-outer">
                  <Link href={`/${companySlug}/permissions/view-role/${role.id}`}>
                    <span><FaEye color="#222" /></span>
                  </Link>
                  <Link href={`/${companySlug}/permissions/edit-role/${role.id}`}>
                    <span><FaEdit color="#222" /></span>
                  </Link>
                  <span onClick={() => handleDeleteRole(role.id)} className="cursor-pointer">
                    <FaTrash color="#222" />
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No roles found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RoleList;
