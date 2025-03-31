'use client';

import React from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { useGetRolesQuery, useDeleteRoleMutation } from "@/slices/roles/rolesApi";
import { useFetchSelectedCompanyQuery } from "@/slices/auth/authApi";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

const RoleList: React.FC = () => {
  // 1) Fetch roles
  const { data: rolesData, isLoading, error, refetch } = useGetRolesQuery(undefined);
  // 2) Prepare to delete roles
  const [deleteRole] = useDeleteRoleMutation();
  // 3) Fetch selected company for building the slug
  const { data: selectedCompany } = useFetchSelectedCompanyQuery();
  const companySlug = selectedCompany?.selected_company?.company_slug;

  // Handler for deleting a role
  const handleDeleteRole = async (id: number) => {
    try {
      await deleteRole(id).unwrap();
      toast.success("Role deleted successfully");
      refetch();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'data' in err) {
        const error = err as { data: { message: string } };
        toast.error(error?.data?.message || "Error deleting role");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  // Handle loading/error states
  if (isLoading) return <div>Loading roles...</div>;
  if (error) {
    toast.error("Error loading roles");
    return <div>Error loading roles.</div>;
  }

  // Render
  return (
    <div>
      <div className="navigation-buttons">
        <Link className="navigation-button" href={`/${companySlug}/hr/add-role`}>
          <FaPlus />
          Add Role
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
            rolesData.roles.map((role: Role) => (
              <tr key={role.id}>
                <td>{role.name}</td>
                <td>
                  {role.permissions
                    ? role.permissions.map((perm: Permission) => perm.name).join(", ")
                    : "None"}
                </td>
                <td>{role.company_id}</td>
                <td>
                  <Link href={`/${companySlug}/hr/edit-role/${role.id}`}>
                    <span>
                      <FaEdit color="#222" />
                    </span>
                  </Link>
                  <span onClick={() => handleDeleteRole(role.id)}>
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
